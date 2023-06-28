{
    "targets": [
        {
            "conditions": [
                ["OS=='win'", {
                    "copies": [{
                        'destination': './build/Release',
                        'files':[
                            './src/SlippiDLL.dll'
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
                '<(module_root_dir)/src/SlippiDLL.lib',
                '<(module_root_dir)/src/FirstDLL.lib'
                ],
            "include_dirs": [
                "./src",
                "./src/headers",
                "C:/Program Files (x86)/boost_1_82_0",
                "<!@(node -p \"require('node-addon-api').include\")"
                ],
            "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ]
        }
    ]
}