==== Digipal Lightbox ====

 - What is Digipal Lightbox?
 	- Digipal Lightbox is an image lightbox to study and analyze manuscripts (but, why not, every kind of image). Have a look at this demo.
 
 - How can I install it?
 	- Digipal Lightbox is a Django app. So you should install it, ad then incorporate it in your project.
 
 - What? A django app? How can I do it?
 	- It is extremely simple. All you have to do, is to load the template tag digipal_lightbox:
 		
 		- On the top of your template:
 		>>>	{% load digipal_lightbox %}	
 	
		- Wherever in your page: 		
 		>>> <div class='container'>{% show_digipal_lightbox %}</div>
 		
 	- Preferably, you should put this tag in a row-fluid class, enough wide to make it resposive.
 
 - Con I modify and use it?
 	- Sure, but read the license first.
 	- Then, have a look to the file structure, and see what you want to edit.
