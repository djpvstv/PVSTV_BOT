#ifndef EXPORTS_H_
#define EXPORTS_H_

#include <map>
#include <vector>
#include <string>

namespace slip {

	struct AnalysisType {
		bool           countMoves = false;
		bool           combos = false;
		bool           conversions = false;
	};

	struct AggregatePreAnalysis {
		std::map<std::string, std::vector<std::string>> tag_player;
		std::vector<std::string>                       tag_code;
		std::map<std::string, std::vector<unsigned>>    char_id;
		std::string               firstDate;
		std::string               lastDate;
		std::vector<std::string>                       filePath;
	};

	struct TargetParams {
		std::string    tag = "";
		std::string    name = "";
		std::string    character = "";
		int            color = 0;
		int            player_port = 5; // index of player port out of 4
		int            opponent_port = 6; // index of opponent port out of 4
		int            player_a_port = 5; // index of player port in analysis object (usually out of 2)
		int            opponent_a_port = 6; // index of opponent port in analysis object (usually out of 2)
		uint8_t        char_id = 0;
		int            comboFrameLimit = 45;
		int            convoFrameLimit = 45;
		int            minMovesForCombo = 2;
		int            minMovesForConvo = 2;
		AnalysisType   analysisType;
	};

	struct ComboMove {
		bool isCreated = false;
		int playerIndex = -1;
		int frame = -1;
		int moveID = -1;
		int hitCount = 0;
		float damage = 0;
	};

	struct Combo {
		bool                   isCreated = false;
		int                    playerIndex = -1;
		int                    startFrame = 0;
		int                    endFrame = -1;
		float                  startPercent = -1;
		float                  endPercent = -1;
		float                  currentPercent = -1;
		std::vector<ComboMove> moves;
		bool                   didKill = false;
		int                    lastHitBy = -1;
	};

	struct Conversion {
		bool                   isCreated = false;
		int                    playerIndex = -1;
		int                    startFrame = 0;
		int                    endFrame = -1;
		float                  startPercent = -1;
		float                  endPercent = -1;
		float                  currentPercent = -1;
		std::vector<ComboMove> moves;
		bool                   didKill = false;
		int                    lastHitBy = -1;
	};

	struct ComboState {
		Combo               combo;
		ComboMove           move;
		int                 resetCounter = -1;
		int                 lastHitAnimation = -1;
		int                 event = -1;
	};

	struct ConversionState {
		Conversion         conversion;
		ComboMove          move;
		int                resetCounter = -1;
		int                lastHitAnimation = -1;
		int                event = -1;
	};
}

#endif /* EXPORTS_H_ */