# -*- coding: utf-8 -*-

from django.http import HttpResponse
from digipal.models import Page
from django.db.models import Q
from django.utils import simplejson
import StringIO
import urllib, cStringIO
import uuid
import Image
from dicttoxml import dicttoxml




def search(request):
	if request.is_ajax():
		pattern = request.POST.get('pattern', '')
		if pattern.strip() != "" and len(pattern.strip()) > 2:
			manuscripts = Page.objects.filter(
			Q(item_part__current_item__repository__place__name__icontains = pattern) | \
			Q(item_part__current_item__repository__name__icontains=pattern)).distinct()
			list_manuscripts = []
			for image in manuscripts:
				result = [image.thumbnail(), image.pk, image.display_label, image.item_part.current_item.repository.name
, image.item_part.current_item.repository.place.name, image.dimensions()]
				list_manuscripts.append(result)
			return HttpResponse(simplejson.dumps(list_manuscripts), mimetype='application/json')
		else:
			return HttpResponse(False)

def save_session(request, file_d):
	# generate the file
	xml = simplejson.dumps(file_d)
	xml_output = dicttoxml(xml)
	file_data = StringIO.StringIO()
	file_data.write(xml_output)
	print xml_output
	response = HttpResponse(file_data.getvalue(), mimetype="text/xml")
	response['Content-Disposition'] = 'attachment; filename=session.xml'
	response['Content-Type'] = 'application/x-download';
	return response


def read_image(request):
	if request.is_ajax():
		image = request.POST.get('image', '')
		image_id = request.POST.get('id', '')
		src_width = request.POST.get('width', '')
		src_height = request.POST.get('height', '')
		manuscript = request.POST.get('manuscript', '')
		file = cStringIO.StringIO(urllib.urlopen(image).read())
		image_resize = Image.open(file)
		width = int(src_width)
		height = int(src_height)
		img = image_resize.resize((width, height), Image.ANTIALIAS)
		box = request.POST.get('box','')
		box_to_crop = simplejson.loads(box)
		coords = (box_to_crop[0], box_to_crop[1], box_to_crop[2], box_to_crop[3])
		area = img.crop(coords)
		tmp = cStringIO.StringIO()
		area.save(tmp, 'JPEG')
		image = tmp.getvalue().encode('base64')
		tmp.close()
		unique_id = uuid.uuid4()
		return HttpResponse('<img data-title ="Region from ' + manuscript + '" class="letter" id="letter_' + image_id + '_' + str(unique_id) + '"  data-size = "' + str(img.size) +'" src="data:image/png;base64,' + image + '" />')

def get_image_manuscript(request):
	if request.is_ajax():
		image_id = request.POST.get('image', '')
		manuscript = Page.objects.get(id=image_id)
		image = [manuscript.thumbnail(), manuscript.pk, manuscript.display_label, manuscript.item_part.current_item.repository.name, manuscript.item_part.current_item.repository.place.name]
		return HttpResponse(simplejson.dumps(image), mimetype='application/json')

