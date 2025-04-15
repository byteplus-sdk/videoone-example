// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import styles from './index.module.less';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  hideLoading?: boolean;
  className?: string;
  maxRetries?: number;
  retryDelay?: number;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt = '',
  className,
  maxRetries = 3,
  retryDelay = 1000,
  hideLoading = false,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = useCallback(() => {
    if (retryCount < maxRetries) {
      setError(false);
      setLoading(true);
      setTimeout(() => {
        setCurrentSrc(`${src}?retry=${retryCount + 1}`);
        setRetryCount(prev => prev + 1);
      }, retryDelay);
    }
  }, [retryCount, maxRetries, src, retryDelay]);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
    if (retryCount < maxRetries) {
      handleRetry();
    }
  }, [retryCount, maxRetries, handleRetry]);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(false);
  }, []);

  return (
    <div className={classNames(styles.imageWrapper, className)}>
      {loading && !hideLoading && (
        <div className={styles.placeholder}>
          <div className={styles.shimmer} />
        </div>
      )}

      <img
        {...props}
        src={currentSrc}
        alt={alt}
        className={classNames(styles.mainImage, {
          [styles.hidden]: loading || error,
        })}
        onError={handleError}
        onLoad={handleLoad}
      />

      {error && retryCount >= maxRetries && (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <span>!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Image;
