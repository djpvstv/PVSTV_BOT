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
		void basicParseSlippiFromPaths(std::vector<std::string> paths);
		std::string printBasicParseSlippiFromPaths(void);

		void parseSlippiFromPaths(std::vector<std::string> paths, slip::TargetParams& t);
		std::string printSlippiCombosFromPaths(void);

	private:
		class ParserImpl;
		std::shared_ptr<ParserImpl> m_ParserImpl;
	};
}

#endif //PARSER_IMPL