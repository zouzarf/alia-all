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
db_handler = DBHandler()
db_handler.setFormatter(logging.Formatter(log_format))


# Add handlers to the logger
logger.addHandler(db_handler)
logging.basicConfig(encoding="utf-8", level=logging.DEBUG)
