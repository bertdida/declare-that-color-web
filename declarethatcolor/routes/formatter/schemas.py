from marshmallow import Schema, fields, validate

from .css import Preprocessor, Vanilla, PREPROCESSOR_PREFIX_MAP, CASE_FUNC_MAP


class RequestSettingsSchema(Schema):
    css_preprocessor = fields.String(
        missing=None,
        allow_none=True,
        validate=validate.OneOf(PREPROCESSOR_PREFIX_MAP.keys()),
    )

    type_case = fields.String(
        missing="dash",
        validate=validate.OneOf(CASE_FUNC_MAP.keys()),
    )

    color_name_prefix = fields.String(missing="")
    css_selector = fields.String(missing=":root")
    use_tabs = fields.Boolean(missing=False)


class RequestSchema(Schema):
    content = fields.Str(required=True)
    settings = fields.Nested(RequestSettingsSchema)
