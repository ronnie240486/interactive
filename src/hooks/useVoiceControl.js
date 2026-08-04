import React, { useState, useEffect, useCallback } from 'react';

export function useVoiceControl({ setScreen, setVoiceChannelSearch, setVoiceMovieSearch, setVoiceSeriesSearch, setVoiceRadioSearch, onCloseModal }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);

  const speakFeedback = (text) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {}
  };

  const cleanVoiceText = (raw) => {
    if (!raw) return '';
    return raw.toLowerCase().replace(/[.,?!;:"]/g, '').replace(/\s+/g, ' ').trim();
  };

  const processVoiceCommand = useCallback((rawText) => {
    const cleanText = cleanVoiceText(rawText);
    setTranscript(cleanText);

    const executeAndClose = (screenTarget, message) => {
      setFeedbackMsg(message);
      speakFeedback(message);
      setScreen(screenTarget);
      setTimeout(() => { if (onCloseModal) onCloseModal(); }, 1500);
    };

    const knownChannels = [
      'space', 'tnt', 'telecine', 'hbo', 'globo', 'sbt', 'record', 'band',
      'sportv', 'premiere', 'megapix', 'warner', 'universal', 'fox', 'axn',
      'disney', 'cartoon', 'discovery', 'history', 'combate', 'amc', 'paramount',
      'espn', 'cinemax', 'studio universal', 'tnt series', 'syfy', 'viva',
      'multishow', 'gnt', 'bis', 'off', 'globonews', 'cnn', 'bandnews',
      'record news', 'jovem pan', 'redetv', 'tv cultura', 'canal rural'
    ];

    const isChannelIntent = cleanText.includes('canal') || cleanText.includes('sintonizar') || knownChannels.some(ch => cleanText.includes(ch));

    if (isChannelIntent) {
      const cleanChannelQuery = cleanText
        .replace(/^(?:abra|ver|assistir|colocar|tocar|sintonizar|bota|botar|ir\s+para)\s+(?:o\s*|a\s*)?/i, '')
        .replace(/^(?:o\s*|a\s*)?canal\s+/i, '').replace(/\s+canal$/i, '').trim();
      const finalChannel = cleanChannelQuery || cleanText;
      if (setVoiceChannelSearch) setVoiceChannelSearch(finalChannel);
      executeAndClose('livetv', `Sintonizando ${finalChannel.toUpperCase()}...`);
      return;
    }

    if (cleanText.includes('filme') || cleanText.includes('assistir filme')) {
      const match = cleanText.match(/(?:abra|ver|assistir|procurar)?\s*(?:o\s*)?filme\s+(?:do\s*|da\s*|de\s*)?(.+)/i);
      const movieQuery = match ? match[1].trim() : cleanText.replace(/filme|assistir|abra|ver|procurar/gi, '').trim();
      if (setVoiceMovieSearch) setVoiceMovieSearch(cleanVoiceText(movieQuery));
      executeAndClose('movies', `Buscando filme ${movieQuery}...`);
      return;
    }

    const directSeriesKeywords = ['walking dead', 'game of thrones', 'breaking bad', 'stranger things', 'loki', 'supernatural', 'grey', 'friends', 'la casa', 'squid'];
    const isDirectSeries = directSeriesKeywords.some(k => cleanText.includes(k));

    if (cleanText.includes('série') || cleanText.includes('serie') || isDirectSeries) {
      const match = cleanText.match(/(?:abra|ver|assistir|procurar)?\s*(?:a\s*)?sér?ie\s+(?:do\s*|da\s*|de\s*)?(.+)/i);
      const seriesQuery = match ? match[1].trim() : cleanText.replace(/série|serie|assistir|abra|ver|procurar/gi, '').trim();
      if (setVoiceSeriesSearch) setVoiceSeriesSearch(cleanVoiceText(seriesQuery));
      executeAndClose('series', `Buscando série ${seriesQuery}...`);
      return;
    }

    if (cleanText.includes('rádio') || cleanText.includes('radio') || cleanText.includes('música')) {
      const match = cleanText.match(/(?:tocar|ouvir|sintonizar|colocar|abra|ver)?\s*(?:a\s*)?rádio\s+(.+)/i) || cleanText.match(/radio\s+(.+)/i);
      const radioQuery = match ? match[1].trim() : cleanText.replace(/rádio|radio|ouvir|tocar|abra|ver|colocar/gi, '').trim();
      const finalRadio = cleanVoiceText(radioQuery);
      if (setVoiceRadioSearch && finalRadio) setVoiceRadioSearch(finalRadio);
      executeAndClose('radios', finalRadio ? `Sintonizando rádio ${finalRadio.toUpperCase()}...` : 'Abrindo Rádios...');
      return;
    }

    if (cleanText.includes('pesquisar') || cleanText.includes('buscar') || cleanText.includes('procurar')) {
      const query = cleanText.replace(/pesquisar|buscar|procurar/gi, '').trim();
      executeAndClose('search', `Pesquisando por ${query}...`);
      return;
    }

    if (cleanText.includes('configuração') || cleanText.includes('configurar') || cleanText.includes('ajustes') || cleanText.includes('settings')) {
      executeAndClose('settings', 'Abrindo Configurações...');
      return;
    }

    if (cleanText.includes('tv ao vivo') || cleanText.includes('ao vivo') || cleanText.includes('canais')) {
      executeAndClose('livetv', 'Abrindo TV ao vivo...');
      return;
    }

    if (cleanText.includes('epg') || cleanText.includes('guia') || cleanText.includes('programação')) {
      executeAndClose('epg', 'Abrindo Guia de Programação...');
      return;
    }

    if (cleanText.includes('jogos') || cleanText.includes('futebol') || cleanText.includes('esporte')) {
      executeAndClose('calendar', 'Abrindo Jogos do Dia...');
      return;
    }

    if (cleanText.includes('início') || cleanText.includes('inicio') || cleanText.includes('home') || cleanText.includes('voltar')) {
      executeAndClose('dashboard', 'Voltando para a tela inicial...');
      return;
    }

    executeAndClose('search', `Pesquisando por: "${rawText}"`);
  }, [setScreen, setVoiceChannelSearch, setVoiceMovieSearch, setVoiceSeriesSearch, setVoiceRadioSearch, onCloseModal]);

  const toggleListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setSpeechSupported(false); return; }
    if (isListening) { setIsListening(false); return; }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onstart = () => { setIsListening(true); setTranscript(''); setFeedbackMsg('🎤 Ouvindo...'); };
      recognition.onresult = (event) => { processVoiceCommand(event.results[0][0].transcript); };
      recognition.onerror = () => { setIsListening(false); setFeedbackMsg('Não entendi. Tente novamente.'); };
      recognition.onend = () => { setIsListening(false); };
      recognition.start();
    } catch (e) { setIsListening(false); }
  }, [isListening, processVoiceCommand]);

  return { isListening, transcript, feedbackMsg, speechSupported, toggleListening };
}