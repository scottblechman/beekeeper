/**
 * Parses the current game data to determine letter distributions used to build hints.
 * @returns answer distribution
 */
function createDistribution() {
  let distribution = {
    range: {
      lowest: Number.MAX_SAFE_INTEGER,
      highest: 0
    },
    twoLetterList: {},
    letterCount: {},
    lengthTotals: {}
  };

  const foundAnswers = getAnswers();
  let answers = window.wrappedJSObject.gameData.today.answers;

  // Workaround for error in filter()
  let filteredAnswers = [];
  for (const a of answers) {
    if (!(foundAnswers.includes(a))) {
      filteredAnswers = filteredAnswers.concat(a);
    }
  }

  for (const answer of filteredAnswers) {
    // Set range of word lengths
    distribution.range.lowest = Math.min(answer.length, distribution.range.lowest);
    distribution.range.highest = Math.max(answer.length, distribution.range.highest);

    // Build first letter list
    const firstLetters = answer.substring(0, 2);

    if (!(firstLetters in distribution.twoLetterList)) {
      distribution.twoLetterList[firstLetters] = {};
      // Need to add the first word's count
      distribution.twoLetterList[firstLetters] = 1;
    } else {
      const prevCount = distribution.twoLetterList[firstLetters];
      distribution.twoLetterList[firstLetters] = prevCount + 1;
    }

    // Build letter count list
    const firstLetter = answer.substring(0, 1);
    if (!(firstLetter in distribution.letterCount)) {
      distribution.letterCount[firstLetter] = {};
      // Need to add the first letter's count
      distribution.letterCount[firstLetter][answer.length] = 1;
    } else {
      if(!(answer.length in distribution.letterCount[firstLetter])) {
        distribution.letterCount[firstLetter][answer.length] = 1;
      } else {
        const prevCount = distribution.letterCount[firstLetter][answer.length];
        distribution.letterCount[firstLetter][answer.length] = prevCount + 1;
      }
    }

    // Build length totals list
    if(!(answer.length in distribution.lengthTotals)) {
      distribution.lengthTotals[answer.length] = 1;
    } else {
      const total = distribution.lengthTotals[answer.length];
      distribution.lengthTotals[answer.length] = total + 1;
    }
  }

  return distribution;
}