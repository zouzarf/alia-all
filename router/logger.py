import logging
import sys

from db import DBHandler

logger = logging.getLogger(__name__)
# Custom log format
log_format = "%(filename)s, %(asctime)s, %(message)s"

# Set up logging
logger = logging.getLogger("MyLogger")
logger.setLevel(logging.DEBUG)

# Create a console handler for stdout
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(logging.Formatter(log_format))
db_handler = DBHandler()
db_handler.setFormatter(logging.Formatter(log_format))


# Add handlers to the logger
logger.addHandler(console_handler)
logger.addHandler(db_handler)
logging.basicConfig(filename="example.log", encoding="utf-8", level=logging.DEBUG)
