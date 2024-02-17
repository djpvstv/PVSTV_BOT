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
                    },
                    "libraries": [
                        '<(module_root_dir)/src/PVSTVSharedLibrary.lib'
                    ],
                    "include_dirs": [
                        "./src",
                        "./src/headers",
                        "C:/Program Files/Boost/boost_1_82_0",
                        "<!@(node -p \"require('node-addon-api').include\")"
                    ]
                }],
                ["OS=='linux'", {
                    "copies": [{
                        'destination': './build/Release',
                        'files':[
                            './src/libPVSTVSharedLibrary.so'
                        ]
                    }],
                    "cflags": ["-fexceptions"],
                    'cflags!': [ '-fno-exceptions' ],
                    'cflags_cc!': [ '-fno-exceptions' ],
                    'ldflags': ['-Wl,-rpath=<(module_root_dir)/src'],
                    "defines": [
                        "_HAS_EXCEPTIONS=1"
                        ],
                    "libraries": [
                        '<(module_root_dir)/src/libPVSTVSharedLibrary.so'
                    ],
                    "variables": {
                        "openssl_fips": ''
                    }
                }]
            ],
            "target_name": "v8engine",
            "cflags!": [ "-fno-exceptions" ],
            "sources": [ 'src/v8engine.cpp' ],
            "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
            "variables": {
                "required_node_version": "18.3.0"
            }
        }
    ]
}