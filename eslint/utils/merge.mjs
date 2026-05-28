export const getFilesKey = (files) => {
  if (!files) return 'global';
  const arr = Array.isArray(files) ? files : [files];
  return [...arr].sort().join(',');
};

export const getSeverityAndOptions = (val) => {
  if (Array.isArray(val)) {
    return { severity: val[0], options: val.slice(1) };
  }
  return { severity: val, options: [] };
};

export const mergeSelectors = (options1, options2) => {
  const merged = [];
  const seen = new Set();
  const add = (opt) => {
    if (opt && typeof opt === 'object' && opt.selector) {
      if (seen.has(opt.selector)) {
        return;
      }
      seen.add(opt.selector);
    }
    merged.push(opt);
  };
  options1.forEach(add);
  options2.forEach(add);
  return merged;
};

export const mergeGlobals = (options1, options2) => {
  const merged = [];
  const seen = new Set();
  const add = (opt) => {
    const key = opt && typeof opt === 'object' ? opt.name : opt;
    if (key) {
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
    }
    merged.push(opt);
  };
  options1.forEach(add);
  options2.forEach(add);
  return merged;
};

export const mergeProperties = (options1, options2) => {
  const merged = [];
  const seen = new Set();
  const add = (opt) => {
    if (opt && typeof opt === 'object' && opt.object && opt.property) {
      const key = `${opt.object}.${opt.property}`;
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
    }
    merged.push(opt);
  };
  options1.forEach(add);
  options2.forEach(add);
  return merged;
};

export const mergeImports = (options1, options2) => {
  const isObj = (x) => x && typeof x === 'object' && (Array.isArray(x.paths) || Array.isArray(x.patterns));
  const obj1 = options1.find(isObj);
  const obj2 = options2.find(isObj);

  if (obj1 || obj2) {
    const paths1 = obj1?.paths || [];
    const paths2 = obj2?.paths || [];
    const patterns1 = obj1?.patterns || [];
    const patterns2 = obj2?.patterns || [];

    const mergedPaths = [];
    const seenPaths = new Set();
    const addPath = (p) => {
      const name = p && typeof p === 'object' ? p.name : p;
      if (name) {
        if (seenPaths.has(name)) {
          return;
        }
        seenPaths.add(name);
      }
      mergedPaths.push(p);
    };
    paths1.forEach(addPath);
    paths2.forEach(addPath);

    const mergedPatterns = [];
    const seenPatterns = new Set();
    const addPattern = (p) => {
      const name = p && typeof p === 'object' ? p.group?.[0] || p.name : p;
      if (name) {
        if (seenPatterns.has(name)) {
          return;
        }
        seenPatterns.add(name);
      }
      mergedPatterns.push(p);
    };
    patterns1.forEach(addPattern);
    patterns2.forEach(addPattern);

    const strings = [
      ...options1.filter((x) => typeof x === 'string'),
      ...options2.filter((x) => typeof x === 'string'),
    ];
    const uniqueStrings = [...new Set(strings)];

    const mergedObj = {};
    if (mergedPaths.length > 0) {
      mergedObj.paths = mergedPaths;
    }
    if (mergedPatterns.length > 0) {
      mergedObj.patterns = mergedPatterns;
    }

    return [mergedObj, ...uniqueStrings];
  }

  const all = [...options1, ...options2];
  return [...new Set(all)];
};

export const mergeGeneric = (options1, options2) => {
  const merged = [];
  const seen = new Set();
  const add = (opt) => {
    const str = typeof opt === 'object' ? JSON.stringify(opt) : String(opt);
    if (seen.has(str)) {
      return;
    }
    seen.add(str);
    merged.push(opt);
  };
  options1.forEach(add);
  options2.forEach(add);
  return merged;
};

export const getMergeStrategy = (ruleName) => {
  if (ruleName === 'no-restricted-syntax') {
    return mergeSelectors;
  }
  if (ruleName === 'no-restricted-globals') {
    return mergeGlobals;
  }
  if (ruleName === 'no-restricted-properties') {
    return mergeProperties;
  }
  if (ruleName === 'no-restricted-imports') {
    return mergeImports;
  }
  return mergeGeneric;
};

export const mergeRuleValues = (val1, val2, ruleName) => {
  if (!val1) return val2;
  if (!val2) return val1;

  const norm1 = getSeverityAndOptions(val1);
  const norm2 = getSeverityAndOptions(val2);

  const severity = norm2.severity;
  const mergeStrategy = getMergeStrategy(ruleName);
  const mergedOptions = mergeStrategy(norm1.options, norm2.options);

  return [severity, ...mergedOptions];
};

export const isRuleMergeable = (ruleName, mergeablePatterns) =>
  mergeablePatterns.some((pattern) => {
    if (pattern.endsWith('-') || pattern.startsWith('no-')) {
      return ruleName.startsWith(pattern);
    }
    return ruleName === pattern;
  });

export const DEFAULT_MERGEABLE_RULES = ['no-restricted-'];

/**
 * Mescla as regras de configuração especificadas (por padrão 'no-restricted-*') em blocos com padrões de arquivos idênticos.
 * @param {import('eslint').Linter.Config[]} configs
 * @param {string[]} [mergeableRulesList=DEFAULT_MERGEABLE_RULES]
 * @returns {import('eslint').Linter.Config[]}
 */
export const mergeConfigRules = (configs, mergeableRulesList = DEFAULT_MERGEABLE_RULES) => {
  const mergeableRules = new Map(); // filesKey -> { ruleName -> mergedValue }

  // Pass 1: Accumulate all mergeable rules across same file patterns
  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    if (!config || !config.rules) continue;

    const filesKey = getFilesKey(config.files);
    if (!mergeableRules.has(filesKey)) {
      mergeableRules.set(filesKey, {});
    }
    const accumulatedRules = mergeableRules.get(filesKey);

    for (const ruleName of Object.keys(config.rules)) {
      if (!isRuleMergeable(ruleName, mergeableRulesList)) continue;

      const currentVal = config.rules[ruleName];
      const previousVal = accumulatedRules[ruleName];
      accumulatedRules[ruleName] = mergeRuleValues(previousVal, currentVal, ruleName);
    }
  }

  // Pass 2: Apply the fully merged rules back to all matching config blocks
  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    if (!config || !config.rules) continue;

    const filesKey = getFilesKey(config.files);
    const accumulatedRules = mergeableRules.get(filesKey);
    if (!accumulatedRules) continue;

    let rulesModified = false;
    const newRules = { ...config.rules };

    for (const ruleName of Object.keys(config.rules)) {
      const isMergeable = isRuleMergeable(ruleName, mergeableRulesList);
      const shouldMerge = isMergeable && accumulatedRules[ruleName];
      if (!shouldMerge) continue;

      newRules[ruleName] = accumulatedRules[ruleName];
      rulesModified = true;
    }

    if (!rulesModified) continue;

    const isFrozen = Object.isFrozen(config) || Object.isFrozen(config.rules);
    if (isFrozen) {
      configs[i] = { ...config, rules: newRules };
      continue;
    }

    config.rules = newRules;
  }

  return configs;
};
