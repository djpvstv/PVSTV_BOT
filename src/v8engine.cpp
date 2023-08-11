#include <node_api.h>
#include <string>
#include <vector>

#include "slippidll.h"

slippiapi::SLParser parser;

std::vector<std::string> getStringVectorFromInput(napi_env env, napi_callback_info info, bool &isValid) {
    // Create a vector of strings to store the result
    std::vector<std::string> strings;

    // Get the arguments passed to the function
    size_t argc = 1;
    napi_value argv[1];
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    // Check if the argument is an array
    bool is_array;
    napi_is_array(env, argv[0], &is_array);
    if (!is_array) {
        isValid = false;
        return strings;
    }

    // Get the length of the array
    uint32_t length;
    napi_get_array_length(env, argv[0], &length);

    // Preset vector length
    strings.reserve(length);

    // Iterate over the array and extract the strings
    for (uint32_t i = 0; i < length; i++) {
        napi_value element;
        napi_get_element(env, argv[0], i, &element);

        size_t str_length;
        napi_get_value_string_utf8(env, element, nullptr, 0, &str_length);

        std::string str(str_length + 1, '\0');
        napi_get_value_string_utf8(env, element, &str[0], str_length + 1, nullptr);

        strings.push_back(str);
    }

    return strings;
}

std::vector<std::string> GetStringVector(napi_env env, napi_value arrayValue) {
  std::vector<std::string> stringVector;

  // Get the length of the JavaScript array
  uint32_t length;
  napi_get_array_length(env, arrayValue, &length);

  // Iterate over the JavaScript array and extract string values
  for (uint32_t i = 0; i < length; i++) {
    napi_value element;
    napi_get_element(env, arrayValue, i, &element);

    size_t strLength;
    napi_get_value_string_utf8(env, element, nullptr, 0, &strLength);

    std::string str(strLength, '\0');
    napi_get_value_string_utf8(env, element, &str[0], strLength + 1, nullptr);

    stringVector.push_back(str);
  }

  return stringVector;
}

std::string getStringFromInput(napi_env env, napi_callback_info info, bool &isValid) {
  // Create a string to store the result
  std::string retString;

  // Get the arguments passed to the function
  size_t argc = 2;
  napi_value argv[2];
  napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

  napi_valuetype arg1_type;
  napi_typeof(env, argv[1], &arg1_type);
  if (arg1_type != napi_string) {
    isValid = false;
    return retString;
  }

  // Convert the second argument to std::string
  size_t str_length;
  napi_get_value_string_utf8(env, argv[1], nullptr, 0, &str_length);

  std::string second_str(str_length + 1, '\0');
  napi_get_value_string_utf8(env, argv[1], &second_str[0], str_length + 1, nullptr);

  return second_str;
}

napi_value CreateStringArray(napi_env env, const std::vector<std::string>& strings) {
  // Create a JavaScript array with the desired length
  size_t length = strings.size();
  napi_value result;
  napi_create_array_with_length(env, length, &result);

  // Populate the JavaScript array with string values
  for (size_t i = 0; i < length; i++) {
    const std::string& str = strings[i];

    napi_value element;
    napi_create_string_utf8(env, str.c_str(), str.length(), &element);

    napi_set_element(env, result, i, element);
  }

  return result;
}

napi_value ResetParseWork(napi_env env, napi_callback_info info) {
  // Reset Prework
    parser.resetParseWork();
    return NULL;
}

napi_value ResetComboWork(napi_env env, napi_callback_info info) {
  // Reset work
    parser.resetComboWork();
    return NULL;
}

napi_value SimpleParse(napi_env env, napi_callback_info info) {
    // Process Input
    bool isValidInput = true;
    std::vector<std::string> cppVec = getStringVectorFromInput(env, info, isValidInput);

    // Validate input
    if (!isValidInput) {
        napi_throw_type_error(env, nullptr, "Argument must be an array of strings");
        return NULL;
    }

    // Compute parsing
    try {
      parser.basicParseSlippiFromPaths(cppVec);
      }
    catch (const std::overflow_error& e) {
      std::string errMsg = "Overflow Error: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (const std::runtime_error& e) {
      std::string errMsg = "Runtime error: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (const std::exception& e) {
      std::string errMsg = "Standard exception: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (...) {
      napi_throw_type_error(env, nullptr, "Unknown error");
      return NULL;
    }
    
    return NULL;
}

napi_value PrintSimpleParse(napi_env env, napi_callback_info info) {

    // Get output from DLL
    std::string outputString = parser.printBasicParseSlippiFromPaths();

    // Create a napi_value from the concatenated string
    napi_value result_value;
    napi_create_string_utf8(env, outputString.c_str(), outputString.length(), &result_value);

    return result_value;
}

napi_value ComboParseByTag(napi_env env, napi_callback_info info) {
    // Process Input
    size_t argc = 3;
    napi_value argv[3];
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    // Check if the first argument is an array
    bool isArray;
    napi_is_array(env, argv[0], &isArray);
    if (!isArray) {
      napi_throw_type_error(env, nullptr, "First argument must be an array");
      return NULL;
    }

    std::vector<std::string> cppVec = GetStringVector(env, argv[0]);

    napi_valuetype arg1_type;
    napi_typeof(env, argv[1], &arg1_type);

    // Validate input
    if (arg1_type != napi_string) {
        napi_throw_type_error(env, nullptr, "Second argument must be a string");
        return NULL;
    }

    // Convert the second argument to std::string
    size_t str_length;
    napi_get_value_string_utf8(env, argv[1], nullptr, 0, &str_length);

    std::string tag_str(str_length, '\0');
    napi_get_value_string_utf8(env, argv[1], &tag_str[0], str_length + 1, nullptr);

    // Ensure the Third argument is an integer
    int32_t frameLimitInt;
    napi_status status = napi_get_value_int32(env, argv[2], &frameLimitInt);
    if (status != napi_ok) {
      napi_throw_type_error(env, nullptr, "Third argument must be an integer");
      return NULL;
    }

    slip::TargetParams tp;
    tp.targetType = slip::TargetType::TAG;
    tp.analysisType.combos = true;
    tp.analysisType.conversions = false;
    tp.analysisType.countMoves = false;

    tp.targetTag = tag_str;
    tp.comboFrameLimit = frameLimitInt;

    try {
      parser.parseSlippiFromPaths(cppVec, tp);
    }
    catch (const std::overflow_error& e) {
      std::string errMsg = "Overflow Error: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (const std::runtime_error& e) {
      std::string errMsg = "Runtime error: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (const std::exception& e) {
      std::string errMsg = "Standard exception: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (...) {
      napi_throw_type_error(env, nullptr, "Unknown error");
      return NULL;
    }

    return NULL;
}

napi_value ComboParseByChar(napi_env env, napi_callback_info info) {
  // Process Input
    size_t argc = 3;
    napi_value argv[3];
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    // Check if the first argument is an array
    bool isArray;
    napi_is_array(env, argv[0], &isArray);
    if (!isArray) {
      napi_throw_type_error(env, nullptr, "First argument must be an array");
      return NULL;
    }

    std::vector<std::string> cppVec = GetStringVector(env, argv[0]);

    // Ensure the second argument is an integer
    int32_t intValue;
    napi_status status = napi_get_value_int32(env, argv[1], &intValue);
    if (status != napi_ok) {
      napi_throw_type_error(env, nullptr, "Second argument must be an integer");
      return NULL;
    }

    // Ensure the third argument is an integer
    int32_t frameLimitInt;
    status = napi_get_value_int32(env, argv[2], &frameLimitInt);
    if (status != napi_ok) {
      napi_throw_type_error(env, nullptr, "Third argument must be an integer");
      return NULL;
    }
    
    slip::TargetParams tp;
    tp.targetType = slip::TargetType::CHAR;
    tp.analysisType.combos = true;
    tp.analysisType.conversions = false;
    tp.analysisType.countMoves = false;

    tp.char_id = intValue;
    tp.comboFrameLimit = frameLimitInt;

    try {
      parser.parseSlippiFromPaths(cppVec, tp);
    }
    catch (const std::overflow_error& e) {
      std::string errMsg = "Overflow Error: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (const std::runtime_error& e) {
      std::string errMsg = "Runtime error: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (const std::exception& e) {
      std::string errMsg = "Standard exception: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (...) {
      napi_throw_type_error(env, nullptr, "Unknown error");
      return NULL;
    }

    return NULL;
}

napi_value ComboParseByCharColor(napi_env env, napi_callback_info info) {
  // Process Input
    size_t argc = 4;
    napi_value argv[4];
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    // Check if the first argument is an array
    bool isArray;
    napi_is_array(env, argv[0], &isArray);
    if (!isArray) {
      napi_throw_type_error(env, nullptr, "First argument must be an array");
      return NULL;
    }

    std::vector<std::string> cppVec = GetStringVector(env, argv[0]);

    // Ensure the second argument is an integer
    int32_t charInt;
    napi_status status = napi_get_value_int32(env, argv[1], &charInt);
    if (status != napi_ok) {
      napi_throw_type_error(env, nullptr, "Second argument must be an integer");
      return NULL;
    }

    // Ensure the third argument is an integer
    int32_t colorInt;
    status = napi_get_value_int32(env, argv[2], &colorInt);
    if (status != napi_ok) {
      napi_throw_type_error(env, nullptr, "Third argument must be an integer");
      return NULL;
    }

    // Ensure the fourth argument is an integer
    int32_t frameLimitInt;
    status = napi_get_value_int32(env, argv[3], &frameLimitInt);
    if (status != napi_ok) {
      napi_throw_type_error(env, nullptr, "Fourth argument must be an integer");
      return NULL;
    }

    slip::TargetParams tp;
    tp.targetType = slip::TargetType::CHAR_COLOR;
    tp.analysisType.combos = true;
    tp.analysisType.conversions = false;
    tp.analysisType.countMoves = false;

    tp.char_id = charInt;
    tp.targetColor = colorInt;
    tp.comboFrameLimit = frameLimitInt;

    try {
      parser.parseSlippiFromPaths(cppVec, tp);
    }
    catch (const std::overflow_error& e) {
      std::string errMsg = "Overflow Error: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (const std::runtime_error& e) {
      std::string errMsg = "Runtime error: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (const std::exception& e) {
      std::string errMsg = "Standard exception: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (...) {
      napi_throw_type_error(env, nullptr, "Unknown error");
      return NULL;
    }

    return NULL;
}

napi_value ComboParseByCharTag(napi_env env, napi_callback_info info) {
  // Process Input
    size_t argc = 4;
    napi_value argv[4];
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    // Check if the first argument is an array
    bool isArray;
    napi_is_array(env, argv[0], &isArray);
    if (!isArray) {
      napi_throw_type_error(env, nullptr, "First argument must be an array");
      return NULL;
    }

    std::vector<std::string> cppVec = GetStringVector(env, argv[0]);

    // Ensure the second argument is an integer
    int32_t charInt;
    napi_status status = napi_get_value_int32(env, argv[1], &charInt);
    if (status != napi_ok) {
      napi_throw_type_error(env, nullptr, "Second argument must be an integer");
      return NULL;
    }

    // Ensure the third value is a string
    napi_valuetype arg3_type;
    napi_typeof(env, argv[2], &arg3_type);

    // Validate input
    if (arg3_type != napi_string) {
        napi_throw_type_error(env, nullptr, "Third argument must be a string");
        return NULL;
    }

    // Convert the second argument to std::string
    size_t str_length;
    napi_get_value_string_utf8(env, argv[2], nullptr, 0, &str_length);

    std::string tag_str(str_length, '\0');
    napi_get_value_string_utf8(env, argv[2], &tag_str[0], str_length + 1, nullptr);

    // Ensure the fourth argument is an integer
    int32_t frameLimitInt;
    status = napi_get_value_int32(env, argv[3], &frameLimitInt);
    if (status != napi_ok) {
      napi_throw_type_error(env, nullptr, "Fourth argument must be an integer");
      return NULL;
    }

    slip::TargetParams tp;
    tp.targetType = slip::TargetType::CHAR_TAG;
    tp.analysisType.combos = true;
    tp.analysisType.conversions = false;
    tp.analysisType.countMoves = false;

    tp.targetTag = tag_str;
    tp.char_id = charInt;
    tp.comboFrameLimit = frameLimitInt;

    try {
      parser.parseSlippiFromPaths(cppVec, tp);
    }
    catch (const std::overflow_error& e) {
      std::string errMsg = "Overflow Error: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (const std::runtime_error& e) {
      std::string errMsg = "Runtime error: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (const std::exception& e) {
      std::string errMsg = "Standard exception: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (...) {
      napi_throw_type_error(env, nullptr, "Unknown error");
      return NULL;
    }

    return NULL;
}

napi_value ComboParseByCharTagColor(napi_env env, napi_callback_info info) {
  // Process Input
    size_t argc = 5;
    napi_value argv[5];
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    // Check if the first argument is an array
    bool isArray;
    napi_is_array(env, argv[0], &isArray);
    if (!isArray) {
      napi_throw_type_error(env, nullptr, "First argument must be an array");
      return NULL;
    }

    std::vector<std::string> cppVec = GetStringVector(env, argv[0]);

    // Ensure the second argument is an integer
    int32_t charInt;
    napi_status status = napi_get_value_int32(env, argv[1], &charInt);
    if (status != napi_ok) {
      napi_throw_type_error(env, nullptr, "Second argument must be an integer");
      return NULL;
    }

    // Ensure the third value is a string
    napi_valuetype arg3_type;
    napi_typeof(env, argv[2], &arg3_type);

    // Validate input
    if (arg3_type != napi_string) {
        napi_throw_type_error(env, nullptr, "Third argument must be a string");
        return NULL;
    }

    // Convert the second argument to std::string
    size_t str_length;
    napi_get_value_string_utf8(env, argv[2], nullptr, 0, &str_length);

    std::string tag_str(str_length, '\0');
    napi_get_value_string_utf8(env, argv[2], &tag_str[0], str_length + 1, nullptr);

    // Ensure the fourth argument is an integer
    int32_t colorInt;
    status = napi_get_value_int32(env, argv[3], &colorInt);
    if (status != napi_ok) {
      napi_throw_type_error(env, nullptr, "Third argument must be an integer");
      return NULL;
    }

    // Ensure the fifth argument is an integer
    int32_t frameLimitInt;
    status = napi_get_value_int32(env, argv[4], &frameLimitInt);
    if (status != napi_ok) {
      napi_throw_type_error(env, nullptr, "Fifth argument must be an integer");
      return NULL;
    }

    slip::TargetParams tp;
    tp.targetType = slip::TargetType::CHAR_TAG_COLOR;
    tp.analysisType.combos = true;
    tp.analysisType.conversions = false;
    tp.analysisType.countMoves = false;

    tp.targetTag = tag_str;
    tp.char_id = charInt;
    tp.targetColor = colorInt;
    tp.comboFrameLimit = frameLimitInt;

    try {
      parser.parseSlippiFromPaths(cppVec, tp);
    }
    catch (const std::overflow_error& e) {
      std::string errMsg = "Overflow Error: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (const std::runtime_error& e) {
      std::string errMsg = "Runtime error: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (const std::exception& e) {
      std::string errMsg = "Standard exception: " + static_cast<std::string>(e.what());
      napi_throw_type_error(env, nullptr, errMsg.c_str());
      return NULL;
    }
    catch (...) {
      napi_throw_type_error(env, nullptr, "Unknown error");
      return NULL;
    }

    return NULL;
}

napi_value PrintCombos(napi_env env, napi_callback_info info) {
    // Get output from DLL
    std::string outputString = parser.printSlippiCombosFromPaths();

    // Create a napi_value from the concatenated string
    napi_value result_value;
    napi_create_string_utf8(env, outputString.c_str(), outputString.length(), &result_value);

    return result_value;
}

napi_value init (napi_env env, napi_value exports) {
    napi_status status;
    napi_value fn;

    status = napi_create_function(env, nullptr, 0, ResetParseWork, nullptr, &fn);
    if (status != napi_ok) return nullptr;
    status = napi_set_named_property(env, exports, "resetParse", fn);
    if (status != napi_ok) return nullptr;

    status = napi_create_function(env, nullptr, 0, ResetComboWork, nullptr, &fn);
    if (status != napi_ok) return nullptr;
    status = napi_set_named_property(env, exports, "resetCombo", fn);
    if (status != napi_ok) return nullptr;

    status = napi_create_function(env, nullptr, 0, SimpleParse, nullptr, &fn);
    if (status != napi_ok) return nullptr;
    status = napi_set_named_property(env, exports, "simpleParse", fn);
    if (status != napi_ok) return nullptr;

    status = napi_create_function(env, nullptr, 0, PrintSimpleParse, nullptr, &fn);
    if (status != napi_ok) return nullptr;
    status = napi_set_named_property(env, exports, "simplePrint", fn);
    if (status != napi_ok) return nullptr;

    status = napi_create_function(env, nullptr, 0, ComboParseByTag, nullptr, &fn);
    if (status != napi_ok) return nullptr;
    status = napi_set_named_property(env, exports, "comboParseByTag", fn);
    if (status != napi_ok) return nullptr;

    status = napi_create_function(env,nullptr, 0, ComboParseByChar, nullptr, &fn);
    if (status != napi_ok) return nullptr;
    status = napi_set_named_property(env, exports, "comboParseByChar", fn);
    if (status != napi_ok) return nullptr;

    status = napi_create_function(env,nullptr, 0, ComboParseByCharColor, nullptr, &fn);
    if (status != napi_ok) return nullptr;
    status = napi_set_named_property(env, exports, "comboParseByCharColor", fn);
    if (status != napi_ok) return nullptr;

    status = napi_create_function(env,nullptr, 0, ComboParseByCharTag, nullptr, &fn);
    if (status != napi_ok) return nullptr;
    status = napi_set_named_property(env, exports, "comboParseByCharTag", fn);
    if (status != napi_ok) return nullptr;

    status = napi_create_function(env,nullptr, 0, ComboParseByCharTagColor, nullptr, &fn);
    if (status != napi_ok) return nullptr;
    status = napi_set_named_property(env, exports, "comboParseByCharTagColor", fn);
    if (status != napi_ok) return nullptr;

    status = napi_create_function(env, nullptr, 0, PrintCombos, nullptr, &fn);
    if (status != napi_ok) return nullptr;
    status = napi_set_named_property(env, exports, "comboPrint", fn);
    if (status != napi_ok) return nullptr;

    return exports;
}

NAPI_MODULE(SimpleParse, init)