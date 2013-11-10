from cicu.widgets import CicuUploderInput

class yourCrop(forms.ModelForm):
    class Meta:
        model = yourModel
        cicuOptions = {
            'ratioWidth': '600',       #fix-width ratio, default 0
            'ratioHeight':'400',       #fix-height ratio , default 0
            'sizeWarning': 'False',    #if True the crop selection have to respect minimal ratio size defined above. Default 'False'
        }
        widgets = {
            'image': CicuUploderInput(options=cicuOptions)
        }