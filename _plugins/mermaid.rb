module Jekyll
	class Mermaid < Liquid::Block
      
	  def render(context)
	    text = super	    
	   " <div class=\"mermaid\">#{text}</div>"
	  end
      
	end
      end
      
      Liquid::Template.register_tag('mermaid', Jekyll::Mermaid)