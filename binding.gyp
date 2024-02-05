{
    "targets": [
        {
            "conditions": [
                ["OS=='win'", {
                    "copies": [{
                        'destination': './build/Release',
                        'files':[
                            './src/PVSTVSharedLibrary.dll'
                        ]
                    }],
                    "defines": [
                        "_HAS_EXCEPTIONS=1"
                    ],
                    "msvs_settings": {
                        "VCCLCompilerTool": {
                            "ExceptionHandling": 1
                        }
                    }
                }]
            ],
            "target_name": "v8engine",
            "cflags!": [ "-fno-exceptions" ],
            "sources": [ 'src/v8engine.cpp' ],
            "libraries": [
                '<(module_root_dir)/src/PVSTVSharedLibrary.lib'
                ],
            "include_dirs": [
                "./src",
                "./src/headers",
                "C:/Program Files/Boost/boost_1_82_0",
                "<!@(node -p \"require('node-addon-api').include\")"
                ],
            "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ]
        }
    ]
}