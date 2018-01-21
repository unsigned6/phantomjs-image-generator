# Project setup & start
```
    npm i
    npm start
```

# APIDOC
To generate image use `/generate` endpoint.
```
    POST /generate

    REQUEST BODY:
    {
        "texts": 
        {
            "text1": "some text 1",
            "text2": "some text 2",
            "text3": "some text 3"
        }
    }
```