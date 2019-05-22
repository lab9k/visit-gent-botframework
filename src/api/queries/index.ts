export const QueryType = {
  Events: `
  PREFIX schema: <http://schema.org/>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  SELECT
    ?attraction
    ?name
    ?description
    ?page
    ?locationPage
    ?image
    (MIN(?from) as ?fromMin)
    (MAX(?to) as ?toMax)
  WHERE {
    ?attraction a schema:Event .
    ?attraction schema:name ?name .
    ?attraction schema:description ?description .
    ?attraction foaf:page ?page .
    ?attraction schema:image ?image .
    OPTIONAL { ?attraction schema:location ?location .
               ?location foaf:page ?locationPage } .
    ?attraction schema:openingHoursSpecification ?spec.
    ?spec schema:validFrom ?outFrom.
    ?spec schema:validThrough ?outTo.
    FILTER (?outFrom <= "{% startDate %}"^^xsd:date)
    FILTER (?outTo >= "{% endDate %}"^^xsd:date)
    FILTER (langMatches(lang(?name), {% lang %})) .
    FILTER (langMatches(lang(?name), lang(?description))) .
    {
      SELECT ?to ?from WHERE {
        ?attraction foaf:page ?page .
        ?attraction schema:openingHoursSpecification ?spec.
        ?spec schema:validFrom ?from.
        ?spec schema:validThrough ?to.
        ?spec schema:opens ?opens.
        ?spec schema:closes ?closes.
      } GROUP BY ?from ?to
    }
  }
  `,
  Attractions: `
  PREFIX schema: <http://schema.org/>
  PREFIX n3: <http://schema.org/>
  SELECT
    ?attraction
    ?name
    ?description
    (IRI(?url) AS ?page)
    (GROUP_CONCAT(?image; SEPARATOR=", ") AS ?imagesList)
  WHERE {
    ?attraction a <http://schema.org/TouristAttraction> .
    ?attraction n3:name ?name .
    ?attraction n3:description ?description .
    ?attraction n3:url ?url .
    ?attraction n3:image ?image .
    FILTER (langMatches(lang(?name), lang(?description))) .
    FILTER (langMatches(lang(?name), {% lang %})) .
  } GROUP BY ?attraction ?name ?description ?url`,
};
