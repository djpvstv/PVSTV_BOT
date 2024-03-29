#ifndef PARSER_IMPL
#define PARSER_IMPL

#include <memory>
#include <string>
#include <vector>

#include "exports.h"

namespace slip {
	class ParserInterfaceImp {
	public:
		ParserInterfaceImp(int debug_num);
		~ParserInterfaceImp(void);

		void reset(void);
		void resetPrework(void);
		void resetWork(void);
		void resetMoveWork(void);
		void basicParseSlippiFromPaths(std::vector<std::string> paths);
		void basicParseSlippiFromPaths(std::vector<std::wstring> paths);
		std::string printBasicParseSlippiFromPaths(void);

		void parseSlippiFromPaths(std::vector<std::wstring> paths, slip::TargetParams &t);
		void parseSlippiFromPaths(std::vector<std::string> paths, slip::TargetParams& t);
		std::string printSlippiCombosFromPaths(void);
		std::string printSlippiMovesFromPaths(void);

		std::string scrapeComboTreeFromPaths(std::vector<std::wstring> paths, slip::TargetParams &t, slip::TreeSettings &ts);

	private:
		class ParserImpl;
		std::shared_ptr<ParserImpl> m_ParserImpl;
	};
}

#endif //PARSER_IMPL