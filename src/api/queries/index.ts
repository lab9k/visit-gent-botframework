export const QueryType = {
  Events: `
  PREFIX n3: <http://schema.org/>
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  SELECT
    ?attraction
    ?name
    ?description
    ?page
    ?startDate
    ?endDate
    ?locationPage
    (GROUP_CONCAT(?image; SEPARATOR=", ") AS ?imagesList)
  FROM <http://stad.gent/tourism/events/>
  WHERE {
    ?attraction a n3:Event .
    ?attraction n3:name ?name .
    ?attraction n3:description ?description .
    ?attraction foaf:page ?page .
    ?attraction n3:image ?image .
    OPTIONAL { ?attraction n3:endDate ?endDate } .
    OPTIONAL { ?attraction n3:startDate ?startDate } .
    OPTIONAL { ?attraction n3:location ?location . ?location foaf:page ?locationPage } .
    FILTER (langMatches(lang(?name), lang(?description))) .
    FILTER (langMatches(lang(?name), {% lang %})) .
  }
  GROUP BY ?attraction ?name ?description ?page ?startDate ?endDate ?locationPage
  `,
  Attractions: `
  PREFIX schema: <http://schema.org/>
  PREFIX n3: <http://schema.org/>
  SELECT
    ?attraction
    ?name
    ?description
    (IRI(?url) AS ?strurl)
    (GROUP_CONCAT(?image; SEPARATOR=", ") AS ?imagesList)
  WHERE {
    ?attraction a <http://schema.org/TouristAttraction> .
    ?attraction n3:name ?name .
    ?attraction n3:description ?description .
    ?attraction n3:url ?url .
    ?attraction n3:image ?image .
    FILTER (langMatches(lang(?name), lang(?description))) .
  } GROUP BY ?attraction ?name ?description ?url`,
};
