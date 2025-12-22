module Jekyll
  module RemoveCharsFilter
    # Minimiza risco de quebrar JSON em `search.json` removendo caracteres
    # comumente problemáticos (aspas e barra invertida) e normalizando espaços.
    def remove_chars(input)
      return "" if input.nil?

      input
        .to_s
        .gsub(/["\\]/, "")
        .gsub(/\s+/, " ")
        .strip
    end
  end
end

Liquid::Template.register_filter(Jekyll::RemoveCharsFilter)


