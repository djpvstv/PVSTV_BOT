#include <iostream>
#include <nan.h>
#include <string>
#include <vector>
#include "slippidll.h"

std::vector<std::string> getStringVectorFromInput(Nan::NAN_METHOD_ARGS_TYPE info, int argNum) {
    v8::Local<v8::Context> context = info.GetIsolate()->GetCurrentContext();

    v8::Local<v8::Array>jsArray = v8::Local<v8::Array>::Cast(info[argNum]);
    v8::Local<v8::Value> tempVal;

    std::vector<std::string> cppVec;

    for (unsigned int i = 0; i < jsArray->Length(); ++i) {
        if (Nan::Get(jsArray, Nan::New(i)).ToLocal(&tempVal)){
            if (tempVal->IsString()) {
                v8::String::Utf8Value utf8_value(info.GetIsolate(), tempVal);
                cppVec.push_back(std::string (*utf8_value));
            }
        }
    }

    return cppVec;
}

void returnStringValue(Nan::NAN_METHOD_ARGS_TYPE info, std::string outStr) {
    v8::Local<v8::Object> retVal = Nan::New<v8::Object>();
    v8::Local<v8::String> json_prop = Nan::New<v8::String>("JSON").ToLocalChecked();
    Nan::Set(retVal, json_prop, Nan::New<v8::String>(outStr.c_str()).ToLocalChecked());
    info.GetReturnValue().Set(retVal);
}

NAN_METHOD(SimpleParse) {
    std::vector<std::string> cppVec = getStringVectorFromInput(info, 0);
    slippiapi::SLParser parser;
    std::string outputString = parser.basicParseSlippiFromPaths(cppVec);

    returnStringValue(info, outputString);
}

NAN_MODULE_INIT(Init) {
    Nan::Set(target, Nan::New<v8::String>("parseSimple").ToLocalChecked(),
    Nan::GetFunction(Nan::New<v8::FunctionTemplate>(SimpleParse)).ToLocalChecked());
}

NODE_MODULE(simpleParse, Init)