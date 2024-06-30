from prisma import Prisma


db = Prisma()
db.connect()
# TODO change to unique
general_config = {i.name: i.value for i in db.general_config.find_many()}
routing_config = db.routes.find_many()
print(general_config)
print(routing_config)
