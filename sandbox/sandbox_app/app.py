import enum
import os
from dataclasses import asdict
from flask import Flask, request
from flask.json import JSONEncoder, jsonify
from .kata import KataInput, execute_kata
from typing import Any


class InvalidAPIUsage(Exception):
    status_code = 400

    def __init__(self, message):
        super().__init__()
        self.message = message

    def to_dict(self):
        return {
            "message": self.message,
        }


def create_app(**_):
    app = Flask(__name__)
    app.config.from_object("sandbox_app.default_settings")

    if os.getenv("SANDBOXAPP_SETTINGS"):
        app.config.from_envvar("SANDBOXAPP_SETTINGS")

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.errorhandler(InvalidAPIUsage)
    def handle_bad_api_call(error: InvalidAPIUsage):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response

    @app.after_request
    def after(response):
        print(response.status)
        print(response.headers)
        print(response.get_data())
        return response
            
    @app.route("/run_kata", methods=["POST"])
    def run_kata():
        try:
            kata = KataInput(**request.get_json())
        except TypeError:
            fields = sorted(list(asdict(KataInput()).keys()))
            raise InvalidAPIUsage(f"Did not receive required fields: {fields}")

        result = execute_kata(kata, app.config["KATA_CONFIG"])
        print(result.response_text)

        return asdict(result)

    return app


class EnumEncoder(JSONEncoder):
    def default(self, o: Any) -> Any:
        if isinstance(o, enum.Enum):
            return o.value
        
        return super().default(o)


if __name__ == "__main__":
    # Set to development by default. Apparently unsavory things happen
    # if we try to do this in the default_settings.py file, so we set it 
    # on the environment variables directly.
    if os.getenv("FLASK_ENV") is None:
        os.environ["FLASK_ENV"] = "development"

    app = create_app()
    app.json_encoder = EnumEncoder
    app.run(port=app.config["PORT"])