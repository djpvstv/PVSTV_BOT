#pragma once

#ifdef _WIN32
	#ifdef SLIPPIDLL_EXPORTS
		#define SLIPPIDLL_API __declspec(dllexport)
	#else
		#define SLIPPIDLL_API __declspec(dllimport)
	#endif
#else
	#define SLIPPIDLL_API
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

// slippc header I need
#include "ParserInterface.hpp"

extern "C" {
	namespace slippiapi {
		class SLIPPIDLL_API SLParser {
		public:
			SLParser();
			~SLParser();
			void reset();
			void resetParseWork();
			void resetComboWork();
			void resetMoveWork();
			void basicParseSlippiFromPaths(std::vector<std::wstring> paths);
			std::string printBasicParseSlippiFromPaths();
			void parseSlippiFromPaths(std::vector<std::wstring> paths, slip::TargetParams& t);
			std::string scrapeComboTreeFromPaths(std::vector<std::wstring> paths, slip::TargetParams &t, slip::TreeSettings &ts);
			std::string printSlippiCombosFromPaths();
			std::string printSlippiMovesFromPaths();
		private:
			std::shared_ptr<slip::ParserInterfaceImp> m_p;
		};
	}
}