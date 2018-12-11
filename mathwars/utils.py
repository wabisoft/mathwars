import sys
import logging
from logging.config import dictConfig

from .config import LOG_LEVEL


def configure_logging(
    format: str = "[%(asctime)s] [%(levelname)-4s] <%(name)s>: %(message)s",
    datefmt: str = "%Y-%m-%dT%H:%M:%S",
    override: dict = None,
) -> None:
    log_conf = {
        "version": 1,
        "formatters": {"standard": {"format": format, "datefmt": datefmt}},
        "handlers": {
            "stream": {
                "level": LOG_LEVEL,
                "class": "logging.StreamHandler",
                "formatter": "standard",
                "stream": sys.stderr,
            }
        },
        "root": {"handlers": ["stream"], "level": LOG_LEVEL},
    }

    if override:
        log_conf.update(override)

    dictConfig(log_conf)


def get_logger(name, **kwargs) -> logging.LoggerAdapter:
    logger = logging.getLogger(name)
    return logging.LoggerAdapter(logger, kwargs)
