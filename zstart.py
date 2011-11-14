from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template
import os.path

class MainPage(webapp.RequestHandler):
    
    def get(self):
        template_values = {}
        path = os.path.join(os.path.dirname(__file__), 'templates', 'index.html')
        output = template.render(path, template_values)
        self.response.out.write(output)
        
class notesHandler(webapp.RequestHandler):
    def get(self):
        template_values = {}
        path = os.path.join(os.path.dirname(__file__), 'templates', 'notes.html')
        output = template.render(path, template_values)
        self.response.out.write(output)

class siteHandler(webapp.RequestHandler):
	def get(self):
		template_values = {}
		path = os.path.join(os.path.dirname(__file__), 'templates', 'site.html')
		output = template.render(path, template_values)
		self.response.out.write(output)
    

application = webapp.WSGIApplication([('/', MainPage),
                                      ('/notes',notesHandler),
									  ('/site',siteHandler),
                                      ], debug=True)


settings = {
    "blog_title": u"ZStart Page",
    "template_path": os.path.join(os.path.dirname(__file__), "templates"),
    "xsrf_cookies": True,
    "autoescape": None,
}

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()