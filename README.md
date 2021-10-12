# Is Mutant Validator 👽

Is Mutant validator te ayudará a encontrar y reclutar la mayor cantidad de mutantes para poder luchar contar los X-Men, es una API REST que te valida si la cadena secuencial enviada es un ADN de un mutante o de un humano, además te muestra estadísticas de las diferentes validaciones que se han hecho.

## Comenzando 🚀

Primero vamos a explicar el funcionamiento del API REST y el cómo utilizarla para poner en evidencia a los mutantes. 

"Is Mutante Validator" cuenta con dos endpoints, en el primero (POST) se envía la cadena secuencial del ADN y este responde con la validación de si es o no un mutante y el otro endpoint (GET) el cual sirve para consultar cuantos mutantes y humanos se han encontrado.

## Validar si es mutante ✅

Se debe realizar un request POST al siguiente endpoint:
```bash
https://co4usqlj99.execute-api.us-east-1.amazonaws.com/mutant
```
Y en el request del body se envia un json con el atributo obligatorio dna de tipo array. Ejemplo:


```json
{
  "dna": [ "ATGCGA", "CAGTGC", "TTATGT", "AAAAGG", "CCCCTA", "TCCCTG" ]
}
```
De esta forma se obtiene una respuesta de tipo json, donde se indica si es o no mutante:
```json
{
    "response": false,
    "message": "El adn pertenece a un MUTANTE!!!"
}
```

## Estadísticas de las validaciones  📋

Se debe realizar un request GET al siguiente endpoint:
```bash
https://co4usqlj99.execute-api.us-east-1.amazonaws.com/stats
```

De esta forma se obtiene una respuesta de tipo json, donde retorna el numero de mutantes y de humanos encontrados en las diferentes validaciones:

```json
{
    "count_mutant_dna": 40,
    "count_human_dna": 100,
    "ratio": 0.4
}
```

## STACK Tecnologico 🔧
Para la creación de esta API REST se utilizaron servicios en la nube implementadas en el servicio de Amazon Web Services, asi que el proyecto fue construido con las siguientes tecnologias:
* [AWS](https://aws.amazon.com/es/) - Plataforma de cloud computing donde se construyo el proyecto.
* [AWS Lambda](https://aws.amazon.com/es/lambda) - Servicio de AWS donde se creo la logica de los endpoints.
* [API Gateway](https://aws.amazon.com/es/api-gateway/) - Servicio de aws donde se construyo la API REST.
* [RDS](https://aws.amazon.com/es/rds/) - Usado para la administracion y creación de bases de datos.
* [MySQL](https://www.mysql.com/) - Motor de base de datos donde se almacena la información.
* [JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript) - Lenguaje de programación utilizado.
* [Node Js](https://nodejs.org/es/) - Entorno de ejecución para JavaScript utilizado en las funciones Lambda.

## Proyecto 📁
El proyecto consta de dos funciones lambda construidas con Node Js 14.x hosteadas en AWS, las cuales pertenecen a cada uno de los endpoints implementados de validación de mutantes y consulta de estadísticas, cada función Lambda tiene asociado su punto de entrada en el archivo index.js donde se tiene toda la lógica  implementada.

Implementado con ❤️    por [Rodrigo Fajardo Fonseca](https://github.com/elkinff) 😊
