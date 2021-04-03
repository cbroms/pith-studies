from aiohttp import web
import datetime
from json import JSONEncoder, dumps
import logging
import mongoengine
import os
from pymongo import MongoClient
import socketio
from socketio import AsyncNamespace

import stages

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
  return datetime.datetime.utcnow()

def form_time(time):
  return time.replace(tzinfo=datetime.timezone.utc).isoformat()

""" Reset. """

db = client["pith_studies"]
sessions = db["sessions"]
params = db["params"]
participants = db["participants"]
consent = db["consent"]
survey_task = db["survey_task"]
survey_pith = db["survey_pith"]

class AdminNamespace(AsyncNamespace):

    async def on_admin_study_setup(self, sid, request):
      """ Do this before Prolific study is even published. """
      session = request["session"]
      logger.info("admin_study_setup({})".format(session))
      # insert if needed
      is_in = sessions.find_one({"session": session})
      if not is_in:
        sessions.insert_one({"session": session})
        params.insert_one({"session": session})
      return {}

    async def on_admin_test_connect(self, sid, request):
      session = request["session"]
      logger.info("admin_test_connect({})".format(session))
      is_in = sessions.find_one({"session": session})
      valid = False
      if is_in:
        valid = True
      self.enter_room(sid, ADMIN_ROOM)
      result = {"valid": valid}
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_admin_set_test_type(self, sid, request):
      """ Do this before people get to tutorials. """
      session = request["session"]
      test_type = request["test_type"]
      logger.info("admin_set_test_type({}, {})".format(session, test_type))
      params.update_one({"session": session}, {"$set": {"test_type": test_type}})
      result = {"test_type": test_type}
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_admin_set_disc_link(self, sid, request):
      """ Do this before people get to discussion. """
      session = request["session"]
      disc_link = request["disc_link"]
      logger.info("admin_set_disc_link({}, {})".format(session, disc_link))
      params.update_one({"session": session}, {"$set": {"disc_link": disc_link}})
      result = {"disc_link": disc_link}
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_admin_set_prolific_link(self, sid, request):
      """ Do this before people finish study. """
      session = request["session"]
      prolific_link = request["prolific_link"]
      logger.info("admin_set_prolific_link({}, {})".format(session, prolific_link))
      params.update_one({"session": session}, {"$set": {"prolific_link": prolific_link}})
      result = {"prolific_link": prolific_link}
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_admin_set_cancel_link(self, sid, request):
      """ Do this before people finish study. """
      session = request["session"]
      cancel_link = request["cancel_link"]
      logger.info("admin_set_cancel_link({}, {})".format(session, cancel_link))
      params.update_one({"session": session}, {"$set": {"cancel_link": cancel_link}})
      result = {"cancel_link": cancel_link}
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_admin_initiate_ready(self, sid, request):
      session = request["session"]
      logger.info("admin_initiate_ready({})".format(session))
      ready_start = get_time()
      ready_end = ready_start + datetime.timedelta(minutes=1)
      ready_start = form_time(ready_start)
      ready_end = form_time(ready_end)

      params.update_one({"session": session}, {"$set": 
        {"ready_start": ready_start, "ready_end": ready_end}
      })

      sess_par = participants.find({"session": session})
      for p in sess_par:
        if p["stage"] == stages.WAITING_ROOM:
          participants.update_one({
            "session": session, 
            "participant_id": p["participant_id"]
          }, {
            "$set": {"stage": stages.WAITING_ROOM_READY},
          })


      result = {"ready_end": ready_end}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "admin_initiate_ready", result, namespace=STUDY_NS, room=TESTER_ROOM
      )
      result = {"ready_start": ready_start, "ready_end": ready_end}
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_admin_term_study(self, sid, request):
      session = request["session"]
      logger.info("admin_term_study({})".format(session))
      params.update_one({"session": session}, {"$set": {"term": True}})
      sess_params = params.find_one({"session": session})
      result = {"cancel_link": sess_params["cancel_link"]}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "admin_term_study", result, namespace=STUDY_NS, room=TESTER_ROOM
      )

    async def on_admin_start_disc(self, sid, request):
      session = request["session"]
      logger.info("admin_start_disc({})".format(session))
      disc_start = get_time()
      disc_end = disc_start + datetime.timedelta(minutes=15)
      disc_start = form_time(disc_start)
      disc_end = form_time(disc_end)

      params.update_one({"session": session}, {"$set": 
        {"disc_start": disc_start, "disc_end": disc_end}
      })
      sess_par = participants.find({"session": session})
      for p in sess_par:
        if p["stage"] == stages.WAITING_ROOM_READY_SUBMITTED:
          participants.update_one({
            "session": session, 
            "participant_id": p["participant_id"]
          }, {
            "$set": {"stage": stages.DISCUSSION},
          })

      sess_params = params.find_one({"session": session})
      result = {"disc_link": sess_params["disc_link"], "disc_end": disc_end}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "admin_start_disc", result, namespace=STUDY_NS, room=TESTER_ROOM
      )
      result = {"disc_start": disc_start, "disc_end": disc_end}
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_admin_end_disc(self, sid, request):
      session = request["session"]
      logger.info("admin_end_disc({})".format(session))
      true_disc_end = form_time(get_time())

      params.update_one({"session": session}, {"$set": {"end_disc": true_disc_end}})
      sess_par = participants.find({"session": session})
      for p in sess_par:
        if p["stage"] == stages.DISCUSSION:
          participants.update_one({
            "session": session, 
            "participant_id": p["participant_id"]
          }, {
            "$set": {"stage": stages.SURVEY_TASK},
          })

      result = {}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "admin_end_disc", result, namespace=STUDY_NS, room=TESTER_ROOM
      )
      result = {"true_disc_end": true_disc_end}
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_admin_study_teardown(self, sid, request):
      session = request["session"]
      logger.info("admin_study_teardown({})".format(session))
      params.update_one({"session": session}, {"$set": {"finish": True}})
      self.close_room(TESTER_ROOM, namespace=STUDY_NS)
      self.leave_room(sid, ADMIN_ROOM)
      return {}

sio.register_namespace(AdminNamespace(ADMIN_NS))


class StudyNamespace(AsyncNamespace):

    async def on_test_connect(self, sid, request):
      session = request["session"]
      participant_id = request["participant_id"]
      logger.info("test_connect({}, {})".format(session, participant_id))
      is_in = sessions.find_one({"session": session})
      valid = False
      if is_in:
        valid = True

      result = {"participant_id": participant_id}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "test_connect", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )

      result = {"valid": valid}
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_join_study(self, sid, request):
      session = request["session"]
      participant_id = request["participant_id"]
      logger.info("join_study({}, {})".format(session, participant_id))

      participants.insert_one({
        "session": session, 
        "participant_id": participant_id,
        "stage": stages.CONSENT,
      })
      self.enter_room(sid, TESTER_ROOM)

      sess_params = params.find_one({"session": session})
      if not "timer_start" in sess_params:
        timer_start = get_time() 
        # 15 for beginning
        timer_end = timer_start + datetime.timedelta(minutes=15)
        timer_start = form_time(timer_start)
        timer_end = form_time(timer_end)
        params.update_one({"session": session}, 
          {"$set": {"timer_start": timer_start, "timer_end": timer_end}}
        )
        # send admin timer
        result = {
          "participant_id": participant_id,
          "timer_start": timer_start,
          "timer_end": timer_end
        }
        result = dumps(result, cls=JSONEncoder)
        await self.emit(
          "join_study", result, namespace=ADMIN_NS, room=ADMIN_ROOM
        )
        # update
        sess_params = params.find_one({"session": session})
      else:
        # don't send admin timer
        result = {"participant_id": participant_id}
        result = dumps(result, cls=JSONEncoder)
        await self.emit(
          "join_study", result, namespace=ADMIN_NS, room=ADMIN_ROOM
        )

      result = {
        "timer_start": sess_params["timer_start"], 
        "timer_end": sess_params["timer_end"]
      }
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_end_consent(self, sid, request):
      session = request["session"]
      participant_id = request["participant_id"]
      response1 = request["response1"]
      response2 = request["response2"]
      response3 = request["response3"]
      logger.info("end_consent({}, {}, {}, {}, {})".format(
        session, participant_id, response1, response2, response3
      ))
      accepted = response1 and response2 and response3
      if accepted:
        consent.insert_one({
          "session": session,
          "participant_id": participant_id,
          "response1": response1,
          "response2": response2,
          "response3": response3,
          "accepted": accepted
        })
        participants.update_one({
          "session": session, 
          "participant_id": participant_id
        }, {
          "$set": {"stage": stages.INSTRUCTIONS},
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
      session = request["session"]
      participant_id = request["participant_id"]

      participants.update_one({
        "session": session, 
        "participant_id": participant_id
      }, {
        "$set": {"stage": stages.TUTORIAL},
      })

      logger.info("end_instr({}, {})".format(session, participant_id))
      result = {"participant_id": participant_id}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "end_instr", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )
      sess_params = params.find_one({"session": session})
      result = {"test_type": sess_params["test_type"]}
      result = dumps(result, cls=JSONEncoder)
      return result

    async def on_end_tutorial(self, sid, request):
      session = request["session"]
      participant_id = request["participant_id"]
      logger.info("end_tutorial({}, {})".format(session, participant_id))

      participants.update_one({
        "session": session, 
        "participant_id": participant_id
      }, {
        "$set": {"stage": stages.WAITING_ROOM},
      })

      result = {"participant_id": participant_id}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "end_tutorial", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )
      return {}

    async def on_end_waiting(self, sid, request):
      session = request["session"]
      participant_id = request["participant_id"]

      participants.update_one({
        "session": session, 
        "participant_id": participant_id
      }, {
        "$set": {"stage": stages.WAITING_ROOM_READY_SUBMITTED},
      })

      logger.info("end_waiting({}, {})".format(session, participant_id))
      result = {"participant_id": participant_id}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "end_waiting", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )
      return {}

    async def on_end_survey_task(self, sid, request):
      session = request["session"]
      participant_id = request["participant_id"]
      answers = request["answers"]
      logger.info("end_survey_task({}, {}, {})".format(session, participant_id, answers))

      participants.update_one({
        "session": session, 
        "participant_id": participant_id
      }, {
        "$set": {"stage": stages.SURVEY_PITH},
      })

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
      session = request["session"]
      participant_id = request["participant_id"]
      answers = request["answers"]
      logger.info("end_survey_pith({}, {}, {})".format(session, participant_id, answers))

      participants.update_one({
        "session": session, 
        "participant_id": participant_id
      }, {
        "$set": {"stage": stages.DONE},
      })
      survey_pith.insert_one(
        {"session": session, "participant_id": participant_id, "answers": answers}
      )
      result = {"participant_id": participant_id}
      result = dumps(result, cls=JSONEncoder)
      await self.emit(
        "end_survey_pith", result, namespace=ADMIN_NS, room=ADMIN_ROOM
      )
      self.leave_room(sid, TESTER_ROOM)
      sess_params = params.find_one({"session": session})
      result = {"prolific_link": sess_params["prolific_link"]}
      result = dumps(result, cls=JSONEncoder)
      return result

sio.register_namespace(StudyNamespace(STUDY_NS))


def main():
    web.run_app(aio_app, port=PORT)
 
if __name__ == '__main__':
    main()
