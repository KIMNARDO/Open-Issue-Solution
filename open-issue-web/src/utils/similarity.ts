import Hangul from 'hangul-js';

const getEditDistance = (a: string, b: string) => {
  const matrix = [];

  // 분해된 자모 단위로 처리
  const splitA = Hangul.disassemble(a);
  const splitB = Hangul.disassemble(b);

  // 초기값 설정
  for (let i = 0; i <= splitB.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= splitA.length; j++) {
    matrix[0][j] = j;
  }

  // 편집 거리 계산
  for (let i = 1; i <= splitB.length; i++) {
    for (let j = 1; j <= splitA.length; j++) {
      if (splitB[i - 1] === splitA[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // 교체
          matrix[i][j - 1] + 1, // 삽입
          matrix[i - 1][j] + 1 // 삭제
        );
      }
    }
  }

  return matrix[splitB.length][splitA.length];
};

export const getSimilarity = (str1: string, str2: string): number => {
  const maxLen = Math.max(Hangul.disassemble(str1).length, Hangul.disassemble(str2).length);
  const editDist = getEditDistance(str1, str2);
  return 1 - editDist / maxLen; // 0 ~ 1 사이의 유사도 반환
};
