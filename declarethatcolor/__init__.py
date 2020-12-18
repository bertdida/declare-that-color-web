import os

from flask import Flask, render_template
from flask_compress import Compress


compress = Compress()

root_path = os.getcwd()
build_path = os.path.join(root_path, "client", "build")


def create_app(config_class):
    app = Flask(
        __name__,
        static_url_path="",
        template_folder=build_path,
        static_folder=build_path,
    )

    compress.init_app(app)

    app.config.from_object(config_class)
    app.url_map.strict_slashes = False

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.errorhandler(404)
    def handle_404(error):
        return render_template("index.html")

    from declarethatcolor.routes.formatter import bp as formatter_bp

    app.register_blueprint(formatter_bp, url_prefix="/api")

    return app
