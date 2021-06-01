import miniMatch from 'minimatch';

/**
 * Check if given file matches one or more patterns
 */
function matchPattern(file: string, pattern: string | string[]):boolean {
  if (!Array.isArray(pattern)) {
    return miniMatch(file, pattern);
  }
  return pattern.filter((item) => miniMatch(file, item)).length > 0;
}

export default matchPattern;
