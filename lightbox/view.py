# -*- coding: utf-8 -*-

from django.http import HttpResponse
from django.db.models import Q
from django.utils import simplejson
from digipal.models import Image, Annotation
import urllib, cStringIO
import uuid
import Image as Img
from django.conf import settings

def search(request):

		pattern = request.POST.get('pattern', '')
		n = request.POST.get('n', '')
		if 'x' in request.POST:
			x = request.POST.get('x', '')
		else:
			x = 0
		if pattern.strip() != "" and len(pattern.strip()) > 2:
			manuscripts = Image.objects.filter(
			Q(item_part__current_item__repository__place__name__icontains = pattern) | \
			Q(item_part__current_item__repository__name__icontains=pattern)).distinct()[x:n]
			count = Image.objects.filter(
			Q(item_part__current_item__repository__place__name__icontains = pattern) | \
			Q(item_part__current_item__repository__name__icontains=pattern)).count()
			list_manuscripts = []
			for image in manuscripts:
				result = [image.thumbnail(), image.id, image.display_label, image.item_part.current_item.repository.name
, image.item_part.current_item.repository.place.name, image.dimensions()]
				list_manuscripts.append(result)
			return HttpResponse(simplejson.dumps({'manuscripts': list_manuscripts, 'count': count}), mimetype='application/json')
		else:
			return HttpResponse(False)


def read_image(request):
		if request.is_ajax():
			image = request.POST.get('image', '')
			image_id = request.POST.get('id', '')
			src_width = request.POST.get('width', '')
			src_height = request.POST.get('height', '')
			manuscript = request.POST.get('manuscript', '')
			box = request.POST.get('box','')
			is_letter = request.POST.get('is_letter', '')
			if is_letter == "false":
				file = cStringIO.StringIO(urllib.urlopen(image).read())
				image_resize = Img.open(file)
				width = int(src_width)
				height = int(src_height)
				img = image_resize.resize((width, height), Img.ANTIALIAS)
				box_to_crop = simplejson.loads(box)
				coords = (box_to_crop[0], box_to_crop[1], box_to_crop[2], box_to_crop[3])
				area = img.crop(coords)
				tmp = cStringIO.StringIO()
				area.save(tmp, 'JPEG')
				image = tmp.getvalue().encode('base64')
				tmp.close()
				unique_id = uuid.uuid4()
				return HttpResponse('<img data-bool="true" data-manuscript_id = "' + image_id + '" data-manuscript= "' + manuscript + '" data-title ="Region from ' + manuscript + '" class="letter" id="letter_' + image_id + '_' + str(unique_id) + '"  data-size = "' + str(area.size[0]) + ',' + str(area.size[1]) + '"  src="data:image/png;base64,' + image + '" />')
			else:
				image = image.replace('data:image/png;base64,', '')
				width = int(src_width)
				height = int(src_height)
				file_image = cStringIO.StringIO(image.decode('base64'))
				image_resize = Img.open(file_image)
				img = image_resize.resize((width, height), Img.ANTIALIAS)
				box_to_crop = simplejson.loads(box)
				coords = (box_to_crop[0], box_to_crop[1], box_to_crop[2], box_to_crop[3])
				area = img.crop(coords)
				tmp = cStringIO.StringIO()
				area.save(tmp, 'JPEG')
				region = tmp.getvalue().encode('base64')
				tmp.close()
				unique_id = uuid.uuid4()
				return HttpResponse('<img data-size = "' + str(width) + ',' + str(height) + '" data-title ="Region from ' + manuscript + '" class="letter" id="letter_' + image_id + '_' + str(unique_id) + '"  data-size = "' + str(img.size) +'" src="data:image/png;base64,' + region + '" />')



def get_image_manuscript(request):
	if request.is_ajax():
		image_id = request.POST.get('image', '')
		manuscript = Image.objects.get(id=image_id)
		image = [manuscript.thumbnail(), manuscript.id, manuscript.display_label, manuscript.item_part.current_item.repository.name, manuscript.item_part.current_item.repository.place.name]
		return HttpResponse(simplejson.dumps(image), mimetype='application/json')


def external_image_request(request):
	if request.GET:
		if 'images' in request.GET and request.GET.get('images', ''):
			images = []
			images_list = simplejson.loads(request.GET.get('images', ''))
			for image_id in images_list:
				manuscript = Image.objects.get(id=image_id)
				size = manuscript.dimensions()
				image = [manuscript.thumbnail(), manuscript.id, manuscript.display_label, manuscript.item_part.current_item.repository.name, manuscript.item_part.current_item.repository.place.name, str(size[0]) + ',' + str(size[1])]
				images.append(image)
			return HttpResponse(simplejson.dumps(images), mimetype='application/json')
		elif 'annotations' in request.GET and request.GET.get('annotations', ''):
			annotations = []
			graphs_list = simplejson.loads(request.GET.get('annotations', ''))
			for graph in graphs_list:
				a = Annotation.objects.get(graph=graph)
				cts = a.get_coordinates()
				coordinates = (cts[1][0] - cts[0][0], cts[1][1] - cts[0][1])
				annotation = [a.thumbnail(), a.id, a.graph.display_label, a.image.item_part.current_item.repository.name, str(coordinates[0]) + ',' + str(coordinates[1])]
				annotations.append(annotation)
			return HttpResponse(simplejson.dumps(annotations), mimetype='application/json')
		else:
			return HttpResponse(False)


def transform_xml(request):
	import lxml.etree as ET
	xml = request.POST.get('xml', '')
	xsl_filename = request.POST.get('xsl_filename', '')
	dom = ET.fromstring(xml)
	xslt = ET.parse(settings.STATIC_ROOT + '/' + xsl_filename)
	transform = ET.XSLT(xslt)
	newdom = transform(dom)
	return HttpResponse(ET.tostring(newdom, pretty_print=True))
	#return HttpResponse(settings.STATIC_ROOT + '/' + xsl_filename)
