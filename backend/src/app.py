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

class StudiesNamespace(AsyncNamespace):

    def generate_params(self):
      current = get_time()
      return {
        "time": current,
        "test_type": self.test_type, 
        "disc_link": self.disc_link, 
        "prolific_link": self.prolific_link
      }

    async def on_admin_study_setup(self, sid, request):
      """ Do this before Prolific study is even published. """

      session = request["session"]
      self.enter_room(sid, ADMIN_ROOM)
      self.session = session
      # save data under given test session
      self.db = client["pith_studies_{}".format(session)]
      self.params = self.db["params"]
      self.consent = self.db["consent"]
      self.survey_task = self.db["survey_task"]
      self.survey_pith = self.db["survey_pith"]

    async def on_admin_set_test_type(self, sid, request):
      """ Do this before people get to tutorials. """

      self.test_type = test_type
      test_type = request["test_type"]
      self.params.insert_one(self.generate_params())

    async def on_admin_set_disc_link(self, sid, request):
      """ Do this before people get to discussion. """

      disc_link = request["disc_link"]
      self.disk_link = disc_link
      self.params.insert_one(self.generate_params())

    async def on_admin_set_prolific_link(self, sid, request):
      """ Do this before people finish study. """

      self.prolific_link = prolific_link
      prolific_link = request["prolific_link"]
      self.params.insert_one(self.generate_params())

    async def on_join_study(self, sid, request):
      participant_id = request["participant_id"]
      result = {"participant_id": participant_id}
      await self.emit("join_study", result, room=ADMIN_ROOM)
      self.enter_room(sid, TESTER_ROOM)

    async def on_end_consent(self, sid, request):
      participant_id = request["participant_id"]
      response1 = request["response1"]
      response2 = request["response2"]
      response3 = request["response3"]
      accepted = response1 and response2 and response3
      self.consent.insert_one({
        "participant_id": participant_id,
        "response1": response1,
        "response2": response2,
        "response3": response3,
        "accepted": accepted
      })
      result = {"participant_id": participant_id, "accepted": accepted}
      await self.emit("end_consent", result, room=ADMIN_ROOM)

    async def on_end_instr(self, sid, request):
      participant_id = request["participant_id"]
      result = {"participant_id": participant_id}
      await self.emit("end_instr", result, room=ADMIN_ROOM)

    async def on_end_tutorial(self, sid, request):
      participant_id = request["participant_id"]
      result = {"participant_id": participant_id}
      await self.emit("end_tutorial", result, room=ADMIN_ROOM)

    async def on_admin_initiate_ready(self, sid, request):
      result = {}
      await self.emit("admin_initiate_ready", result, room=TESTER_ROOM)

    async def on_end_waiting(self, sid, request):
      participant_id = request["participant_id"]
      result = {"participant_id": participant_id}
      await self.emit("end_waiting", result, room=ADMIN_ROOM)

    async def on_admin_start_disc(self, sid, request):
      self.start_disc = get_time()
      result = {"disc_link": self.disc_link}
      self.emit("admin_start_disc", result, room=TESTER_ROOM)

    async def on_admin_end_disc(self, sid, request):
      self.end_disc = get_time()
      result = {}
      self.emit("admin_end_disc", result, room=TESTER_ROOM)

    async def on_end_survey_task(self, sid, request):
      participant_id = request["participant_id"]
      answers = request["answers"]
      self.survey_task.insert_one(
        {"participant_id": participant_id, "answers": answers}
      )
      result = {"participant_id": participant_id}
      await self.emit("end_survey_task", result, room=ADMIN_ROOM)

    async def on_end_survey_pith(self, sid, request):
      participant_id = request["participant_id"]
      answers = request["answers"]
      self.survey_pith.insert_one(
        {"participant_id": participant_id, "answers": answers}
      )
      result = {"participant_id": participant_id}
      await self.emit("end_survey_pith", result, room=ADMIN_ROOM)
      self.leave_room(sid, TESTER_ROOM)
      result = {"prolific_link": self.prolific_link}
      return result

    async def on_admin_study_teardown(self, sid, request):
      self.leave_room(sid, ADMIN_ROOM)

sio.register_namespace(StudiesNamespace('/Studies'))


def main():
    web.run_app(aio_app, port=PORT)
 
if __name__ == '__main__':
    main()
