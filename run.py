import os

from declarethatcolor import create_app

app = create_app(config_class=os.environ["CONFIG_CLASS"])

if __name__ == "__main__":
    app.run()
