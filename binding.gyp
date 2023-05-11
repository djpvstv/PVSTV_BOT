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
                    }]
                }]
            ],
            "target_name": "v8engine",
            "sources": [ 'src/v8engine.cpp' ],
            "libraries": [ 
                '<(module_root_dir)/src/SlippiDLL.lib',
                '<(module_root_dir)/src/FirstDLL.lib'
                ],
            "include_dirs": [
                "./src",
                "C:/Program Files (x86)/boost_1_82_0",
                "<!(node -e \"require('nan')\")"
                ]
        }
    ]
}