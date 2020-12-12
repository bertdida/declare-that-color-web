from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from .css import Preprocessor, Vanilla
from .schemas import RequestSchema, RequestSettingsSchema

bp = Blueprint("formatter", __name__, url_prefix="/formatter")


@bp.route("/", methods=["POST"])
def index():
    json_data = request.get_json()
    request_schema = RequestSchema()
    request_settings_schema = RequestSettingsSchema()

    try:
        data = request_schema.load(json_data)
    except ValidationError as err:
        return err.messages, 422

    content = data["content"]
    settings = data.get("settings", request_settings_schema.load({}))

    if settings["css_preprocessor"]:
        css_obj = Preprocessor(settings)
    else:
        css_obj = Vanilla(settings)

    result = css_obj.declare_hexcodes(content)
    return jsonify({"result": result})
