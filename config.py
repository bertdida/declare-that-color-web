import os


class Config:
    SECRET_KEY = os.environ["SECRET_KEY"]


class Development(Config):
    ENV = "development"
    DEBUG = True


class Production(Config):
    ENV = "production"
    DEBUG = False
