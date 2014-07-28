<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:template match="/">
        <html>
            <head>
                <title>Digipal Images</title>
                <style>
                 body{
                    width:960px;
                    margin: auto;
                    font-family: Helvetica, Arial;
                    color: #666;
                }
                #regions{
               	   margin-top:2%;
                }
                .letter{
                   margin:1%;
                   display: inline-block;
                }
                 h1{
                     font-size: 36px;
                     color: #666;
                     border-bottom:1px solid #ccc;
                     padding-bottom: 15px;
                 }

                 h2{
                     font-size: 24px;
                     color: #666;
                     border-bottom:1px solid #ccc;
                     padding-bottom:3px;
                 }

                 .manuscript{
                     margin:1%;
                     border-bottom:1px dotted #efefef;
                     padding:1%;
                 }
                </style>
            </head>
            <body>
                <xsl:apply-templates />
            </body>
        </html>
    </xsl:template>
    <xsl:template match="regions">
    <div id='regions'>
		<h1>Digipal Images</h1>
        <a style='float:right;margin-top:-10%;' href='http://digipal.eu'><img src ='http://digipal.eu/static/digipal/images/headerLogo.png' /></a>
		<xsl:apply-templates />
    </div>
    </xsl:template>
    <xsl:template match="manuscript">
 	<div class='manuscript' id="{id}">
 	<h2><xsl:value-of select='title' /></h2>
    <xsl:for-each select="letter">
		<div class='letter'>
		    <div class='image' id='{id}'>
		        <img src = '{src}' />
		    </div>
	    </div>
    </xsl:for-each>
   </div>
    </xsl:template>
</xsl:stylesheet>
