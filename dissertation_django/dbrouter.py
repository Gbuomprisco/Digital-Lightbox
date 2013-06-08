class DigipalDBRouter(object):
    """A router to control all database operations on models in
    the digipal application"""

    def db_for_read(self, model, **hints):
        "Point all operations on legacy models to 'legacy'"
        if model._meta.app_label == 'legacy':
            return 'legacy'
        return None
