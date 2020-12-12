import os


class Config:
    SECRET_KEY = os.environ["SECRET_KEY"]


class Development(Config):
    ENV = "development"
    DEBUG = True
