#pragma once

#ifdef SLIPPIDLL_EXPORTS
#define SLIPPIDLL_API __declspec(dllexport)
#else
#define SLIPPIDLL_API __declspec(dllimport)
#endif

// Standard Cpp includes
#define NOMINMAX
#include <vector>
#include <string>
#include <filesystem>
#include <chrono>
#include <string>

// Slippi Structs I made
#include "exports.h"

extern "C" {
	namespace slippiapi {
		class SLIPPIDLL_API SLParser {
		public:
			SLParser();
			~SLParser();
			double addTwoNumbersIncorrectly(double a, double b);
			std::string basicParseSlippiFromPath(std::string path, slip::AggregatePreAnalysis aggregatePrework);
			std::string basicParseSlippiFromPaths(std::vector<std::string> paths);
		};
	}
}