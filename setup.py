#!/usr/bin/env python

from setuptools import setup, find_packages


setup(name='Digital Lightbox',
      version='0.1',
      description='Digital Lightbox for Manuscript Images',
      author='Giancarlo Buomprisco',
      author_email='giancarlopsk@gmail.com',
      url='https://github.com/Gbuomprisco/Digital-Lightbox',
      packages=find_packages(),
      include_package_data=True,
      packages_data = ['static', 'templates'],
)
