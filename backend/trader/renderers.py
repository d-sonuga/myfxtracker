from rest_framework.renderers import BaseRenderer


class BinaryRenderer(BaseRenderer):
    media_type = 'application/ex4'
    format = 'binary'
    charset = None
    render_style = 'binary'

    def render(self, data, accepted_media_type=None, renderer_context=None):
        return data