# Starting the Flask app

### Running locally

```python
conda activate memory
python -m sandbox_app.app
```

### Running in production

This is not ideal long term: [what we should do](https://flask.palletsprojects.com/en/1.1.x/tutorial/deploy/)

```python
export FLASK_ENV=production
export SANDBOXAPP_SETTINGS=path/to/the/settings.cfg
python -m sandbox_app.app
```