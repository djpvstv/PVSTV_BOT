#pragma once

#ifdef SLIPPIDLL_EXPORTS
#define SLIPPIDLL_API __declspec(dllexport)
#else
#define SLIPPIDLL_API __declspec(dllimport)
#endif

// Standard Cpp includes
#define NOMINMAX
#include <vector>
#include <memory>
#include <string>
#include <filesystem>
#include <chrono>
#include <string>

// Slippi Structs I made
#include "exports.h"

// Include one slippi header that's required
#include "ParserImplementation.h"

extern "C" {
	namespace slippiapi {
		class SLIPPIDLL_API SLParser {
		public:
			SLParser();
			~SLParser();
			void reset();
			void resetParseWork();
			void resetComboWork();
			void basicParseSlippiFromPaths(std::vector<std::string> paths);
			std::string printBasicParseSlippiFromPaths();
			void parseSlippiFromPaths(std::vector<std::string> paths, slip::TargetParams& t);
			std::string printSlippiCombosFromPaths();
		private:
			std::shared_ptr<slip::ParserInterfaceImp> m_p;
		};
	}
}