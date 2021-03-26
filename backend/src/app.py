from aiohttp import web
import datetime
from json import JSONEncoder, dumps
import logging
import mongoengine
import os
from pymongo import MongoClient
import socketio
from socketio import AsyncNamespace

# logger
LOG_FILENAME = "session"
logger = logging.getLogger("app_logger")
fh = logging.FileHandler(LOG_FILENAME)
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
fh.setFormatter(formatter)
logger.addHandler(fh)
logger.setLevel(logging.DEBUG)

# constants
MONGODB_CONN = os.getenv("MONGODB_CONN", "mongodb://localhost:27017")
MONGODB_NAME = os.getenv("MONGODB_NAME", "pith_studies")
logger.info("Mongo: {} {}".format(MONGODB_CONN, MONGODB_NAME))
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
global session
global test_type, disc_link, prolific_link
global start_disc, end_disc
session = None
test_type = None
disc_link = None
prolific_link = None
start_disc = None
end_disc = None

db = client["pith_studies"]
#sessions = db["sessions"]
#params = db["params"]
consent = db["consent"]
survey_task = db["survey_task"]
survey_pith = db["survey_pith"]

class AdminNamespace(AsyncNamespace):

    def generate_params(self):
      current = get_time()
      return {
        "session": session,
        "time": current,
        "test_type": test_type, 
        "disc_link": disc_link, 
        "prolific_link": prolific_link,
        "start_disc": start_disc,
        "end_disc": end_disc
      }

    async def on_admin_study_setup(self, sid, request):
      """ Do this before Prolific study is even published. """
      session = request["session"]
      logger.info("admin_study_setup({})".format(session))
      # insert if needed
      #sessions.update_one({"session": session}, {}, upsert=True)
      self.enter_room(sid, ADMIN_ROOM)
      # save data under given test session
      return {}

    async def on_admin_set_test_type(self, sid, request):
      """ Do this before people get to tutorials. """
      global test_type 

      test_type = request["test_type"]
      logger.info("admin_set_test_type({})".format(test_type))
      # params.insert_one(self.generate_params())
      result = {"test_type": test_type}
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_admin_set_disc_link(self, sid, request):
      """ Do this before people get to discussion. """
      global disc_link 

      disc_link = request["disc_link"]
      logger.info("admin_set_disc_link({})".format(disc_link))
      #params.insert_one(self.generate_params())
      result = {"disc_link": disc_link}
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_admin_set_prolific_link(self, sid, request):
      """ Do this before people finish study. """
      global prolific_link 

      prolific_link = request["prolific_link"]
      logger.info("admin_set_prolific_link({})".format(prolific_link))
      #params.insert_one(self.generate_params())
      result = {"prolific_link": prolific_link}
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_admin_initiate_ready(self, sid, request):
      logger.info("admin_initiate_ready()")
      result = {}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "admin_initiate_ready", result, namespace=STUDY_NS, room=TESTER_ROOM
      )
      return {}

    async def on_admin_start_disc(self, sid, request):
      global start_disc 

      logger.info("admin_start_disc()")
      start_disc = get_time()
      result = {"disc_link": disc_link}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "admin_start_disc", result, namespace=STUDY_NS, room=TESTER_ROOM
      )
      result = {"start_disc": start_disc}
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_admin_end_disc(self, sid, request):
      global end_disc 

      logger.info("admin_end_disc()")
      end_disc = get_time()
      result = {}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "admin_end_disc", result, namespace=STUDY_NS, room=TESTER_ROOM
      )
      result = {"end_disc": end_disc}
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_admin_study_teardown(self, sid, request):
      logger.info("admin_study_teardown()")
      self.close_room(TESTER_ROOM, namespace=STUDY_NS)
      self.leave_room(sid, ADMIN_ROOM)
      return {}

sio.register_namespace(AdminNamespace(ADMIN_NS))


class StudyNamespace(AsyncNamespace):

    async def on_join_study(self, sid, request):
      participant_id = request["participant_id"]
      logger.info("join_study({})".format(participant_id))
      result = {"participant_id": participant_id}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "join_study", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )
      self.enter_room(sid, TESTER_ROOM)
      return {}

    async def on_end_consent(self, sid, request):
      participant_id = request["participant_id"]
      response1 = request["response1"]
      response2 = request["response2"]
      response3 = request["response3"]
      logger.info("end_consent({}, {}, {}, {})".format(
        participant_id, response1, response2, response3
      ))
      accepted = response1 and response2 and response3
      consent.insert_one({
        "session": session,
        "participant_id": participant_id,
        "response1": response1,
        "response2": response2,
        "response3": response3,
        "accepted": accepted
      })
      result = {"participant_id": participant_id, "accepted": accepted}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "end_consent", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )
      result = {"accepted": accepted}
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_end_instr(self, sid, request):
      participant_id = request["participant_id"]
      logger.info("end_instr({})".format(participant_id))
      result = {"participant_id": participant_id}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "end_instr", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )
      result = {"test_type": test_type}
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_end_tutorial(self, sid, request):
      participant_id = request["participant_id"]
      logger.info("end_tutorial({})".format(participant_id))
      result = {"participant_id": participant_id}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "end_tutorial", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )
      return {}

    async def on_end_waiting(self, sid, request):
      participant_id = request["participant_id"]
      logger.info("end_waiting({})".format(participant_id))
      result = {"participant_id": participant_id}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "end_waiting", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )
      return {}

    async def ready_disc(self, sid, request):
      participant_id = request["participant_id"]
      logger.info("ready_disc({})".format(participant_id))
      result = {"participant_id": participant_id}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "ready_disc", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )
      return {}

    async def start_disc(self, sid, request):
      participant_id = request["participant_id"]
      logger.info("start_disc({})".format(participant_id))
      result = {"participant_id": participant_id}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "start_disc", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )
      return {}

    async def end_disc(self, sid, request):
      participant_id = request["participant_id"]
      logger.info("end_disc({})".format(participant_id))
      result = {"participant_id": participant_id}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "end_disc", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )
      return {}

    async def on_end_survey_task(self, sid, request):
      participant_id = request["participant_id"]
      answers = request["answers"]
      logger.info("end_survey_task({}, {})".format(participant_id, answers))
      survey_task.insert_one({
        "session": session, "participant_id": participant_id, "answers": answers
      })
      result = {"participant_id": participant_id}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "end_survey_task", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )
      return {}

    async def on_end_survey_pith(self, sid, request):
      participant_id = request["participant_id"]
      answers = request["answers"]
      logger.info("end_survey_pith({}, {})".format(participant_id, answers))
      survey_pith.insert_one(
        {"session": session, "participant_id": participant_id, "answers": answers}
      )
      result = {"participant_id": participant_id}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "end_survey_pith", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )
      self.leave_room(sid, TESTER_ROOM)
      result = {"prolific_link": prolific_link}
      result = dumps(result, cls=JSONEncoder)
      return result

sio.register_namespace(StudyNamespace(STUDY_NS))


def main():
    web.run_app(aio_app, port=PORT)
 
if __name__ == '__main__':
    main()
