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
    ?from
    ?to
    ?opensTime
    ?closesTime
    (GROUP_CONCAT(?image; SEPARATOR=", ") AS ?imagesList)
  FROM <http://stad.gent/tourism/events/>
  WHERE {
    ?attraction a schema:Event .
    ?attraction schema:name ?name .
    ?attraction schema:description ?description .
    ?attraction foaf:page ?page .
    ?attraction schema:image ?image .
    ?attraction schema:openingHoursSpecification ?spec .
    ?spec schema:validFrom ?from .
    ?spec schema:validThrough ?to .
    ?spec schema:opens ?opens .
    ?spec schema:closes ?closes .
    OPTIONAL { ?attraction schema:location ?location .
               ?location foaf:page ?locationPage } .
    FILTER (langMatches(lang(?name), lang(?description))) .
    FILTER (langMatches(lang(?name), {% lang %})) .
    # Filter to make sure events happen around specified date
    FILTER (?from <= "{% startDate %}"^^xsd:date)
    FILTER (?to >= "{% endDate %}"^^xsd:date)
    BIND(STRDT(CONCAT("{% startDate %}T",?opens,":00"), xsd:dateTime) as ?opensTime)
    BIND(STRDT(CONCAT("{% endDate %}T",?closes,":00"), xsd:dateTime) as ?closesTime)
    # Next filter can specify the hour events are open. Not needed for now.
    # FILTER(?opensTime < "2019-05-21T14:00:00"^^xsd:dateTime)
    # FILTER(?closesTime > "2019-05-21T15:00:00"^^xsd:dateTime)
  } ORDER BY DESC(?from)
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
