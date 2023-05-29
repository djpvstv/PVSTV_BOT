#pragma once


#ifdef SLIPPIDLL_EXPORTS
#define SLIPPIDLL_API __declspec(dllexport)
#else
#define SLIPPIDLL_API __declspec(dllimport)
#endif

extern "C" {
	namespace slippcapi {
		class SLIPPIDLL_API Dummy {
		public:
			Dummy();
			~Dummy();
			double addTwoNumbersIncorrectly(double a, double b);
		};
	}
}
