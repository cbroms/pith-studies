from aiohttp import web
import datetime
import mongoengine
import os
from pymongo import MongoClient
from random import randint
import socketio
from socketio import AsyncNamespace

# constants
MONGODB_CONN = os.getenv("MONGODB_CONN", "mongodb://localhost:27017")
MONGODB_NAME = os.getenv("MONGODB_NAME", "pith")
PORT = os.getenv("PORT", 8080)
ADMIN_NS = "/Admin"
STUDY_NS = "/Study"
ADMIN_ROOM = "admin"
TESTER_ROOM = "tester"

# start up connections
sio = socketio.AsyncServer(
    async_mode='aiohttp',
    cors_allowed_origins="*"
)
aio_app = web.Application()
sio.attach(aio_app)

client = MongoClient(MONGODB_CONN)
mongoengine.connect(MONGODB_NAME, host=MONGODB_CONN)

def get_time():
  return datetime.datetime.utcnow().replace(tzinfo=datetime.timezone.utc).isoformat()

""" Reset. """
global session, test_type, disc_link, prolific_link
global db, params, consent, survey_task, survey_pith
global start_disc, end_disc
session = None
test_type = None
disc_link = None
prolific_link = None
db = None
params = None
consent = None
survey_task = None
survey_pith = None
start_disc = None
end_disc = None

class AdminNamespace(AsyncNamespace):

    def generate_params(self):
      current = get_time()
      return {
        "time": current,
        "test_type": test_type, 
        "disc_link": disc_link, 
        "prolific_link": prolific_link
      }

    async def on_admin_study_setup(self, sid, request):
      """ Do this before Prolific study is even published. """
      global session, db, params, consent, survey_task, survey_pith

      _session = request["session"]
      self.enter_room(sid, ADMIN_ROOM)
      session = _session
      # save data under given test session
      db = client["pith_studies_{}".format(session)]
      params = db["params"]
      consent = db["consent"]
      survey_task = db["survey_task"]
      survey_pith = db["survey_pith"]

    async def on_admin_set_test_type(self, sid, request):
      """ Do this before people get to tutorials. """
      global test_type 

      _test_type = request["test_type"]
      test_type = _test_type
      params.insert_one(self.generate_params())

    async def on_admin_set_disc_link(self, sid, request):
      """ Do this before people get to discussion. """
      global disc_link 

      _disc_link = request["disc_link"]
      disk_link = _disc_link
      params.insert_one(self.generate_params())

    async def on_admin_set_prolific_link(self, sid, request):
      """ Do this before people finish study. """
      global prolific_link 

      _prolific_link = request["prolific_link"]
      prolific_link = _prolific_link
      params.insert_one(self.generate_params())

    async def on_admin_initiate_ready(self, sid, request):
      result = {}
      await self.emit(
        "admin_initiate_ready", result, namespace=STUDY_NS, room=TESTER_ROOM
      )

    async def on_admin_start_disc(self, sid, request):
      global start_disc 

      start_disc = get_time()
      result = {"disc_link": disc_link}
      self.emit(
        "admin_start_disc", result, namespace=STUDY_NS, room=TESTER_ROOM
      )
      result = {"start_disc": start_disc}
      self.emit("admin_start_disc", result, room=ADMIN_ROOM)

    async def on_admin_end_disc(self, sid, request):
      global end_disc 

      end_disc = get_time()
      result = {}
      self.emit(
        "admin_end_disc", result, namespace=STUDY_NS, room=TESTER_ROOM
      )
      result = {"end_disc": end_disc}
      self.emit("admin_end_disc", result, room=ADMIN_ROOM)

    async def on_admin_study_teardown(self, sid, request):
      self.leave_room(sid, ADMIN_ROOM)

sio.register_namespace(AdminNamespace(ADMIN_NS))


class StudyNamespace(AsyncNamespace):

    async def on_join_study(self, sid, request):
      participant_id = request["participant_id"]
      result = {"participant_id": participant_id}
      await self.emit(
        "join_study", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )
      self.enter_room(sid, TESTER_ROOM)

    async def on_end_consent(self, sid, request):
      participant_id = request["participant_id"]
      response1 = request["response1"]
      response2 = request["response2"]
      response3 = request["response3"]
      accepted = response1 and response2 and response3
      consent.insert_one({
        "participant_id": participant_id,
        "response1": response1,
        "response2": response2,
        "response3": response3,
        "accepted": accepted
      })
      result = {"participant_id": participant_id, "accepted": accepted}
      await self.emit(
        "end_consent", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )

    async def on_end_instr(self, sid, request):
      participant_id = request["participant_id"]
      result = {"participant_id": participant_id}
      await self.emit(
        "end_instr", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )

    async def on_end_tutorial(self, sid, request):
      participant_id = request["participant_id"]
      result = {"participant_id": participant_id}
      await self.emit(
        "end_tutorial", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )

    async def on_end_waiting(self, sid, request):
      participant_id = request["participant_id"]
      result = {"participant_id": participant_id}
      await self.emit(
        "end_waiting", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )

    async def on_end_survey_task(self, sid, request):
      participant_id = request["participant_id"]
      answers = request["answers"]
      survey_task.insert_one(
        {"participant_id": participant_id, "answers": answers}
      )
      result = {"participant_id": participant_id}
      await self.emit(
        "end_survey_task", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )

    async def on_end_survey_pith(self, sid, request):
      participant_id = request["participant_id"]
      answers = request["answers"]
      survey_pith.insert_one(
        {"participant_id": participant_id, "answers": answers}
      )
      result = {"participant_id": participant_id}
      await self.emit(
        "end_survey_pith", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )
      self.leave_room(sid, TESTER_ROOM)
      result = {"prolific_link": prolific_link}
      return result

sio.register_namespace(StudyNamespace(STUDY_NS))


def main():
    web.run_app(aio_app, port=PORT)
 
if __name__ == '__main__':
    main()
