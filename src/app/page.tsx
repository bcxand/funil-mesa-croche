'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, Award, Download, Star, CheckCircle, Clock, Users, Gift, X, Zap, Target, TrendingUp, Loader2, Sparkles, BarChart3, Heart, Home, Frown, ShoppingCart } from 'lucide-react'

interface QuizAnswer {
  questionId: string
  answer: string | string[]
}

interface QuizState {
  currentStep: 'hero' | 'quiz' | 'summary' | 'loading' | 'sales'
  currentQuestion: number
  answers: QuizAnswer[]
  points: number
  badgeUnlocked: boolean
  previewUnlocked: boolean
  showAchievement: boolean
  achievementMessage: string
}

const QUESTIONS = [
  {
    id: 'q1',
    title: 'Você já trabalha com costura ou algo relacionado a crochê?',
    type: 'single',
    color: 'sky', // Azul claro
    options: [
      { value: 'professional', label: '🤩 Sim, sou costureira profissional', emoji: '🤩' },
      { value: 'hobby', label: '😊 Sim, faço por hobby / complemento de renda', emoji: '😊' },
      { value: 'beginner', label: '😉 Não, mas quero aprender e lucrar!', emoji: '😉' },
      { value: 'learn', label: '😌 Só quero aprender a fazer!', emoji: '😌' }
    ]
  },
  {
    id: 'q2',
    title: 'Você já fez algum curso sobre mesa posta em crochê?',
    type: 'single',
    color: 'sky', // Azul claro
    options: [
      { value: 'never', label: '🤩 Nunca fiz, esse vai ser o primeiro', emoji: '🤩' },
      { value: 'one', label: '📖 Já fiz um curso', emoji: '📖' },
      { value: 'several', label: '🎓 Já fiz vários cursos', emoji: '🎓' }
    ]
  },
  {
    id: 'q3',
    title: 'Quanto tempo por dia você tem pra criar peças?',
    type: 'single',
    color: 'sky', // Azul claro
    options: [
      { value: 'short', label: '🕑 15min–1h', emoji: '🕑' },
      { value: 'medium', label: '🕓 3–4h', emoji: '🕓' },
      { value: 'full', label: '🕙 Tenho o dia todo!', emoji: '🕙' }
    ]
  },
  {
    id: 'summary1',
    title: '✨ Analisando seu perfil criativo...',
    type: 'summary',
    color: 'sky',
    subtitle: 'Identificamos que você tem potencial único! Vamos personalizar tudo para você.',
    insights: [
      '🎯 Mapeando suas habilidades atuais',
      '⏰ Calculando tempo ideal de dedicação',
      '💡 Definindo estratégia personalizada'
    ]
  },
  {
    id: 'q4',
    title: 'O que mais te incomoda hoje?',
    type: 'multi',
    color: 'sky', // Azul claro
    options: [
      { value: 'money', label: '😞 Não sobra dinheiro para fazer o que gosto', emoji: '😞' },
      { value: 'time', label: '😰 Falta de tempo pra família', emoji: '😰' },
      { value: 'savings', label: '😭 Não consigo guardar dinheiro', emoji: '😭' }
    ]
  },
  {
    id: 'q5',
    title: 'Quanto você gostaria de ganhar por mês com crochê?',
    type: 'single',
    color: 'sky', // Azul claro
    options: [
      { value: '500', label: '💰 R$ 500 extras', emoji: '💰' },
      { value: '1500', label: '🎯 R$ 1.500 por mês', emoji: '🎯' },
      { value: '3000', label: '🚀 R$ 3.000 ou mais', emoji: '🚀' }
    ]
  },
  {
    id: 'q6',
    title: 'Depois de criar peças, qual será seu principal objetivo?',
    type: 'single',
    color: 'sky', // Azul claro
    options: [
      { value: 'sell', label: '📈 Aprender a vender e lucrar com mesa posta', emoji: '📈' },
      { value: 'leverage', label: '🥂 Alavancar resultados do meu negócio atual', emoji: '🥂' },
      { value: 'hobby', label: '🎓 Só quero fazer por hobby/prazer', emoji: '🎓' }
    ]
  },
  {
    id: 'preanalise1',
    title: 'Mas precisa ter habilidade ou ser especialista?',
    type: 'preanalise',
    color: 'sky',
    image: 'https://media.inlead.cloud/uploads/1072/2025-09-20/md-mEGze-banner-novo-mesa.png',
    content: `A resposta é não!
Com os Moldes Prontos + 500 receitas de crochê, você aprende a criar cada peça de crochê para mesa posta de forma muito simples e prática, mesmo que nunca tenha feito crochê antes.

Basta seguir o passo a passo do molde e ver sua peça tomando forma com rapidez, sem complicação ou dificuldade.

Pra você ter noção, minha sobrinha de 11 anos conseguiu fazer sua primeira peça de crochê em apenas 30 minutos, mesmo sem nunca ter pegado numa agulha de crochê antes! ✨`
  },
  {
    id: 'preanalise2',
    title: 'A melhor parte!',
    type: 'preanalise',
    color: 'sky',
    image: 'https://media.inlead.cloud/uploads/1072/2025-09-19/md-1e1xg-mesa-banner-2.png',
    content: `O melhor é que o custo pra produzir é super baixo. Com menos de R$ 7,00 você já consegue fazer peças lindas de crochê para mesa posta, como sousplats, jogos americanos e porta-guardanapos.

Isso significa que você pode começar com pouco dinheiro e ainda assim ter uma ótima margem de lucro, criando produtos que realmente vendem!`
  },
  {
    id: 'preanalise3',
    title: 'Depoimentos das alunas do treinamento Mesa Posta Lucrativa!',
    type: 'preanalise',
    color: 'sky',
    subtitle: 'Esse é o resultado das alunas que aplicaram nosso treinamento conseguiram alcançar.',
    testimonials: [
      'https://media.inlead.cloud/uploads/1072/2025-09-27/sm-LjjYP-whatsapp-image-2025-09-27-at-151738.jpg',
      'https://media.inlead.cloud/uploads/1072/2025-09-27/sm-2TX6s-whatsapp-image-2025-09-27-at-151737.jpg'
    ]
  },
  {
    id: 'summary2',
    title: '🎨 Criando sua estratégia financeira...',
    type: 'summary',
    color: 'sky',
    subtitle: 'Suas metas estão claras! Agora vamos montar o plano perfeito para alcançá-las.',
    insights: [
      '💰 Calculando potencial de faturamento',
      '📊 Definindo estratégias de venda',
      '🎯 Personalizando cronograma de resultados'
    ]
  },
  {
    id: 'news-insight',
    title: '📊 Você sabia? Trabalhar de casa muda tudo!',
    type: 'news',
    color: 'sky',
    subtitle: 'Pesquisa da Universidade de Oxford revela dados surpreendentes',
    newsData: {
      homeWorkers: 78,
      unhappyWorkers: 34,
      happinessIncrease: 23
    }
  },
  {
    id: 'q8',
    title: 'Como você prefere vender suas peças?',
    type: 'single',
    color: 'sky', // Azul claro
    options: [
      { value: 'individual', label: 'Avulsas' },
      { value: 'kits', label: 'Kits (mais lucro)' },
      { value: 'both', label: 'Ambos' }
    ]
  },
  {
    id: 'q9',
    title: 'Qual seu nível de comprometimento?',
    type: 'slider',
    color: 'sky' // Azul claro
  },
  {
    id: 'summary3',
    title: '🏆 Seu perfil está completo!',
    type: 'summary',
    color: 'sky',
    subtitle: 'Parabéns! Agora temos tudo para criar seu plano personalizado de sucesso.',
    insights: [
      '✅ Perfil completo mapeado',
      '🎯 Estratégia personalizada definida',
      '🚀 Plano de ação pronto para execução'
    ]
  }
]

// Color schemes for psychology - AZUL CLARO PRINCIPAL
const getColorScheme = (color: string) => {
  const schemes = {
    sky: {
      bg: 'from-sky-50 to-sky-100',
      card: 'border-sky-200 bg-sky-50/50',
      button: 'from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700',
      text: 'text-gray-900', // Texto preto
      accent: 'text-sky-600'
    },
    emerald: {
      bg: 'from-emerald-50 to-emerald-100',
      card: 'border-emerald-200 bg-emerald-50/50',
      button: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
      text: 'text-gray-900',
      accent: 'text-emerald-600'
    },
    blue: {
      bg: 'from-blue-50 to-blue-100',
      card: 'border-blue-200 bg-blue-50/50',
      button: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      text: 'text-gray-900',
      accent: 'text-blue-600'
    },
    orange: {
      bg: 'from-orange-50 to-orange-100',
      card: 'border-orange-200 bg-orange-50/50',
      button: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      text: 'text-gray-900',
      accent: 'text-orange-600'
    },
    red: {
      bg: 'from-red-50 to-red-100',
      card: 'border-red-200 bg-red-50/50',
      button: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      text: 'text-gray-900',
      accent: 'text-red-600'
    },
    green: {
      bg: 'from-green-50 to-green-100',
      card: 'border-green-200 bg-green-50/50',
      button: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      text: 'text-gray-900',
      accent: 'text-green-600'
    },
    indigo: {
      bg: 'from-indigo-50 to-indigo-100',
      card: 'border-indigo-200 bg-indigo-50/50',
      button: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
      text: 'text-gray-900',
      accent: 'text-indigo-600'
    },
    pink: {
      bg: 'from-pink-50 to-pink-100',
      card: 'border-pink-200 bg-pink-50/50',
      button: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
      text: 'text-gray-900',
      accent: 'text-pink-600'
    },
    teal: {
      bg: 'from-teal-50 to-teal-100',
      card: 'border-teal-200 bg-teal-50/50',
      button: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
      text: 'text-gray-900',
      accent: 'text-teal-600'
    },
    violet: {
      bg: 'from-violet-50 to-violet-100',
      card: 'border-violet-200 bg-violet-50/50',
      button: 'from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700',
      text: 'text-gray-900',
      accent: 'text-violet-600'
    },
    cyan: {
      bg: 'from-cyan-50 to-cyan-100',
      card: 'border-cyan-200 bg-cyan-50/50',
      button: 'from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700',
      text: 'text-gray-900',
      accent: 'text-cyan-600'
    },
    purple: {
      bg: 'from-purple-50 to-purple-100',
      card: 'border-purple-200 bg-purple-50/50',
      button: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      text: 'text-gray-900',
      accent: 'text-purple-600'
    },
    gold: {
      bg: 'from-yellow-50 to-amber-100',
      card: 'border-amber-200 bg-amber-50/50',
      button: 'from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700',
      text: 'text-gray-900',
      accent: 'text-amber-600'
    }
  }
  return schemes[color as keyof typeof schemes] || schemes.sky
}

// Sound effects simulation
const playClickSound = () => {
  if (typeof window !== 'undefined') {
    console.log('🔊 Click sound played')
  }
}

const playProgressSound = () => {
  if (typeof window !== 'undefined') {
    console.log('🔊 Progress sound played')
  }
}

const playSuccessSound = () => {
  if (typeof window !== 'undefined') {
    console.log('🔊 Success sound played')
  }
}

export default function FunilCroche() {
  // Reset state on page reload
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear localStorage on component mount (page reload)
      localStorage.removeItem('croche-quiz-state')
    }
  }, [])

  const [quizState, setQuizState] = useState<QuizState>({
    currentStep: 'hero',
    currentQuestion: 0,
    answers: [],
    points: 0,
    badgeUnlocked: false,
    previewUnlocked: false,
    showAchievement: false,
    achievementMessage: ''
  })

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [sliderValue, setSliderValue] = useState(50)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Timer states
  const [salesTimer, setSalesTimer] = useState(300) // 5 minutes in seconds
  const [discountTimer, setDiscountTimer] = useState(180) // 3 minutes for discount popup (increased)
  const [showDiscountPopup, setShowDiscountPopup] = useState(false)
  const [purchaseNotifications, setPurchaseNotifications] = useState<Array<{id: number, name: string, visible: boolean}>>([])

  // Timer effects
  useEffect(() => {
    if (quizState.currentStep === 'sales' && salesTimer > 0) {
      const interval = setInterval(() => {
        setSalesTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [quizState.currentStep, salesTimer])

  // Discount popup timer
  useEffect(() => {
    if (quizState.currentStep === 'sales' && discountTimer > 0) {
      const interval = setInterval(() => {
        setDiscountTimer(prev => {
          if (prev <= 1) {
            setShowDiscountPopup(true)
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [quizState.currentStep, discountTimer])

  // Purchase notifications every 15 seconds
  useEffect(() => {
    if (quizState.currentStep === 'sales') {
      const names = ['Maria Silva', 'Ana Costa', 'Carla Santos', 'Lucia Oliveira', 'Fernanda Lima', 'Patricia Souza']
      let notificationId = 0
      
      const interval = setInterval(() => {
        const randomName = names[Math.floor(Math.random() * names.length)]
        const newNotification = {
          id: notificationId++,
          name: randomName,
          visible: true
        }
        
        setPurchaseNotifications(prev => [...prev, newNotification])
        
        // Hide notification after 5 seconds
        setTimeout(() => {
          setPurchaseNotifications(prev => 
            prev.map(notif => 
              notif.id === newNotification.id ? {...notif, visible: false} : notif
            )
          )
        }, 5000)
        
        // Remove from array after 6 seconds
        setTimeout(() => {
          setPurchaseNotifications(prev => 
            prev.filter(notif => notif.id !== newNotification.id)
          )
        }, 6000)
        
      }, 15000)
      
      return () => clearInterval(interval)
    }
  }, [quizState.currentStep])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startQuiz = () => {
    playClickSound()
    setIsTransitioning(true)
    setTimeout(() => {
      setQuizState(prev => ({ ...prev, currentStep: 'quiz' }))
      setIsTransitioning(false)
      // Scroll to top when starting quiz
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 300)
  }

  const nextQuestion = () => {
    const currentQ = QUESTIONS[quizState.currentQuestion]
    let answer: string | string[]

    if (currentQ.type === 'multi') {
      answer = selectedAnswers
      if (selectedAnswers.length === 0) return
    } else if (currentQ.type === 'slider') {
      answer = sliderValue.toString()
    } else if (currentQ.type === 'summary' || currentQ.type === 'news' || currentQ.type === 'preanalise') {
      // For summary, news and preanalise, just advance immediately
      playClickSound()
      setIsTransitioning(true)
      setTimeout(() => {
        if (quizState.currentQuestion < QUESTIONS.length - 1) {
          setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }))
        } else {
          // Go to loading screen before sales
          setQuizState(prev => ({ ...prev, currentStep: 'loading' }))
          // After 3 seconds, go to sales
          setTimeout(() => {
            setQuizState(prev => ({ ...prev, currentStep: 'sales' }))
          }, 3000)
        }
        setIsTransitioning(false)
        // Scroll to top when advancing
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 300)
      return
    } else {
      answer = selectedAnswers[0] || ''
      if (!answer) return
    }

    playClickSound()

    // Calculate points
    let pointsToAdd = 10
    if (currentQ.unlockPreview) {
      pointsToAdd = 20
      setQuizState(prev => ({ ...prev, previewUnlocked: true }))
    }

    // Update answers and points
    const newAnswers = [...quizState.answers]
    const existingIndex = newAnswers.findIndex(a => a.questionId === currentQ.id)
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { questionId: currentQ.id, answer }
    } else {
      newAnswers.push({ questionId: currentQ.id, answer })
    }

    const newPoints = quizState.points + pointsToAdd
    const newBadgeUnlocked = newPoints >= 50

    setSelectedAnswers([])
    setSliderValue(50)
    setIsTransitioning(true)

    setTimeout(() => {
      playProgressSound()
      setQuizState(prev => ({
        ...prev,
        answers: newAnswers,
        points: newPoints,
        badgeUnlocked: newBadgeUnlocked,
        currentQuestion: prev.currentQuestion < QUESTIONS.length - 1 ? prev.currentQuestion + 1 : prev.currentQuestion,
        currentStep: prev.currentQuestion >= QUESTIONS.length - 1 ? 'loading' : 'quiz'
      }))
      setIsTransitioning(false)
      
      // Scroll to top when advancing
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      // After loading, go to sales
      if (quizState.currentQuestion >= QUESTIONS.length - 1) {
        setTimeout(() => {
          setQuizState(prev => ({ ...prev, currentStep: 'sales' }))
        }, 3000)
      }
    }, 300)
  }

  const handleSingleChoice = (value: string) => {
    playClickSound()
    setSelectedAnswers([value])
  }

  const handleCheckout = async () => {
    if (typeof window === 'undefined') return
    
    playClickSound()
    const payload = {
      answers: quizState.answers,
      points: quizState.points,
      timestamp: new Date().toISOString()
    }
    
    console.log('Sending to backend:', payload)
    
    const leadId = 'lead_' + Date.now()
    const checkoutUrl = `https://checkout.example.com?lead_id=${leadId}&utm=croche_quiz&price=37`
    
    alert(`Redirecionando para checkout: ${checkoutUrl}`)
  }

  const handleDiscountCheckout = async () => {
    if (typeof window === 'undefined') return
    
    playClickSound()
    const payload = {
      answers: quizState.answers,
      points: quizState.points,
      timestamp: new Date().toISOString(),
      discount: true
    }
    
    console.log('Sending to backend with discount:', payload)
    
    const leadId = 'lead_' + Date.now()
    const checkoutUrl = `https://checkout.example.com?lead_id=${leadId}&utm=croche_quiz_discount&price=19.90`
    
    alert(`Redirecionando para checkout com desconto: ${checkoutUrl}`)
    setShowDiscountPopup(false)
  }

  const progressPercentage = ((quizState.currentQuestion + 1) / QUESTIONS.length) * 100

  // Get personalized data
  const getPersonalizedData = () => {
    const timeAnswer = quizState.answers.find(a => a.questionId === 'q3')?.answer
    const goalAnswer = quizState.answers.find(a => a.questionId === 'q5')?.answer
    const expAnswer = quizState.answers.find(a => a.questionId === 'q1')?.answer
    const problemsAnswer = quizState.answers.find(a => a.questionId === 'q4')?.answer as string[]
    
    let targetEarning = 'R$ 3.500'
    let timeCommitment = 'flexível'
    let experienceLevel = 'iniciante'
    let days = '30'
    let analysis = ''
    
    if (goalAnswer === '500') {
      targetEarning = 'R$ 500'
      days = '30'
    } else if (goalAnswer === '1500') {
      targetEarning = 'R$ 1.500'
      days = '30'
    } else if (goalAnswer === '3000') {
      targetEarning = 'R$ 3.000'
      days = '30'
    }
    
    if (timeAnswer === 'short') {
      timeCommitment = '15min-1h por dia'
    } else if (timeAnswer === 'medium') {
      timeCommitment = '3-4h por dia'
    } else if (timeAnswer === 'full') {
      timeCommitment = 'tempo integral'
    }
    
    if (expAnswer === 'professional') experienceLevel = 'profissional'
    else if (expAnswer === 'hobby') experienceLevel = 'intermediário'
    else if (expAnswer === 'beginner') experienceLevel = 'iniciante motivada'
    
    // Create personalized analysis
    analysis = `Baseado em uma análise sobre você, identificamos que você é uma pessoa ${experienceLevel} que tem ${timeCommitment} disponível e deseja alcançar ${targetEarning} mensais. `
    
    if (problemsAnswer?.includes('money')) {
      analysis += 'Percebemos que a questão financeira é uma preocupação, e por isso criamos um plano focado em resultados rápidos. '
    }
    
    if (problemsAnswer?.includes('time')) {
      analysis += 'Sabemos que o tempo com a família é precioso, então nosso método é otimizado para máxima eficiência. '
    }
    
    analysis += `Seu plano personalizado foi desenvolvido para que você alcance ${targetEarning} em apenas ${days} dias, trabalhando ${timeCommitment}.`
    
    return { targetEarning, timeCommitment, experienceLevel, days, analysis }
  }

  if (quizState.currentStep === 'hero') {
    return (
      <div className={`min-h-screen transition-all duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'} bg-gradient-to-br from-sky-50 to-sky-100`}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight text-center">
                A VOLTA DA TENDÊNCIA: MESA POSTA DE CROCHÊ que vende MUITO! 🤩
              </h1>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-sky-200 mb-8 transform hover:scale-105 transition-all duration-300">
              <div className="space-y-4 text-center">
                <p className="text-sky-800 leading-relaxed text-lg text-center">
                  Oi, tudo bem? Me chamo Isadora Melo e trabalho com crochê desde 2023.
                </p>
                
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border border-green-200">
                  <p className="text-green-800 font-semibold text-xl text-center">
                    Descobri um jeito <strong>NOVO e SIMPLES</strong> de GANHAR MAIS de <strong className="text-green-700 text-2xl">R$3.500/mês</strong> fazendo peças de crochê para mesa posta
                  </p>
                  <p className="text-green-700 mt-2 text-center">mesmo sem experiência!</p>
                </div>

                {/* Imagem adicionada acima do texto */}
                <div className="my-6">
                  <img 
                    src="https://media.inlead.cloud/uploads/1072/2025-09-18/lg-Hb7K3-banner-1-mpl.png" 
                    alt="Banner Mesa Posta Lucrativa" 
                    className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg"
                  />
                </div>

                <p className="text-sky-800 text-lg text-center">
                  E o melhor? No final desse questionário eu vou te mostrar o <strong>plano personalizado</strong> pra você começar.
                </p>
              </div>

              <button
                onClick={startQuiz}
                className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold py-6 px-8 rounded-2xl hover:from-sky-600 hover:to-sky-700 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3 text-xl mt-8"
              >
                <Sparkles className="w-6 h-6" />
                Quero meu plano personalizado
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (quizState.currentStep === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100">
        <div className="text-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-sky-200">
            <Loader2 className="w-20 h-20 text-sky-600 animate-spin mx-auto mb-8" />
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Criando seu plano personalizado...
            </h2>
            <p className="text-sky-700 mb-8 text-lg text-center">
              Estamos analisando suas respostas para criar uma estratégia única para você!
            </p>
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-6 h-6 text-sky-500 animate-pulse" />
              <span className="text-sky-600 text-lg">Personalizando conteúdo...</span>
              <Sparkles className="w-6 h-6 text-sky-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (quizState.currentStep === 'quiz') {
    const currentQ = QUESTIONS[quizState.currentQuestion]
    const colorScheme = getColorScheme(currentQ?.color || 'sky')
    
    return (
      <div className={`min-h-screen transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} bg-gradient-to-br ${colorScheme.bg} px-4 py-8 md:px-0 md:py-8`}>
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            {/* Header with Progress - NO QUESTION COUNT */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                {quizState.badgeUnlocked && (
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${colorScheme.card}`}>
                    <Award className="w-3 h-3" />
                    Pronta para começar
                  </div>
                )}
              </div>

              {/* Dynamic Progress Bar */}
              <div className={`relative w-full bg-white/50 rounded-full h-4 mb-2 border ${colorScheme.card.includes('border-') ? colorScheme.card.split(' ')[0] : 'border-sky-200'}`}>
                <div 
                  className={`bg-gradient-to-r ${colorScheme.button.split(' ')[0]} ${colorScheme.button.split(' ')[1]} h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  <div className="absolute right-0 top-0 w-2 h-full bg-black/20 rounded-r-full"></div>
                </div>
              </div>
              <p className={`text-xs text-center ${colorScheme.accent}`}>
                {quizState.points} pontos • Tecendo seu futuro... 🧶
              </p>
            </div>

            {/* Question Card */}
            <div className={`bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border transition-all duration-500 ${isTransitioning ? 'scale-95 opacity-0' : 'scale-100 opacity-100'} ${colorScheme.card}`}>
              <h2 className={`text-2xl font-bold mb-6 text-center ${colorScheme.text}`}>
                {currentQ.title}
              </h2>

              {currentQ.subtitle && (
                <p className={`text-center mb-6 italic rounded-2xl p-4 border ${colorScheme.card}`}>
                  {currentQ.subtitle}
                </p>
              )}

              {/* Pré-análise Type */}
              {currentQ.type === 'preanalise' && (
                <>
                  <div className="text-center space-y-6 mb-8">
                    {currentQ.image && (
                      <div className="mb-6">
                        <img 
                          src={currentQ.image} 
                          alt="Imagem ilustrativa" 
                          className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
                        />
                      </div>
                    )}
                    
                    {currentQ.content && (
                      <div className={`p-6 rounded-xl ${colorScheme.card} text-left`}>
                        <p className={`${colorScheme.text} leading-relaxed whitespace-pre-line`}>
                          {currentQ.content}
                        </p>
                      </div>
                    )}
                    
                    {currentQ.testimonials && Array.isArray(currentQ.testimonials) && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {currentQ.testimonials.map((testimonial, index) => (
                          <div key={index} className="mb-4">
                            <img 
                              src={testimonial} 
                              alt={`Depoimento ${index + 1}`} 
                              className="w-full rounded-2xl shadow-lg"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={nextQuestion}
                    className={`w-full text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r ${colorScheme.button} shadow-2xl hover:shadow-xl transform hover:scale-105 text-xl border-4 border-white/70`}
                  >
                    Continuar
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Summary Type with Insights - CONTINUE BUTTON */}
              {currentQ.type === 'summary' && (
                <>
                  <div className="text-center space-y-6 mb-8">
                    {currentQ.insights && Array.isArray(currentQ.insights) && (
                      <div className="space-y-3">
                        {currentQ.insights.map((insight, index) => (
                          <div key={index} className={`flex items-center justify-center gap-3 p-3 rounded-xl ${colorScheme.card}`}>
                            <CheckCircle className={`w-5 h-5 ${colorScheme.accent}`} />
                            <span className={`${colorScheme.text} text-center`}>{insight}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={nextQuestion}
                    className={`w-full text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r ${colorScheme.button} shadow-2xl hover:shadow-xl transform hover:scale-105 text-xl border-4 border-white/70`}
                  >
                    Continuar
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* News Type with Interactive Chart - CONTINUE BUTTON ADDED */}
              {currentQ.type === 'news' && (
                <>
                  <div className="text-center space-y-8 mb-8">
                    <div className={`rounded-2xl p-6 border ${colorScheme.card}`}>
                      <h3 className={`text-xl font-bold mb-4 ${colorScheme.text} text-center`}>
                        📊 Dados que Mudam Tudo
                      </h3>
                      
                      {/* Interactive Chart */}
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="text-center">
                          <div className="relative w-24 h-24 mx-auto mb-3">
                            <div className="absolute inset-0 rounded-full bg-green-200"></div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-green-600" style={{clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 78%, 50% 50%)'}}></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Home className="w-8 h-8 text-green-700" />
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-green-600">78%</p>
                          <p className="text-sm text-green-700">Trabalham de casa</p>
                          <p className="text-xs text-green-600">e são mais felizes</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="relative w-24 h-24 mx-auto mb-3">
                            <div className="absolute inset-0 rounded-full bg-red-200"></div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-red-600" style={{clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 34%, 50% 50%)'}}></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Frown className="w-8 h-8 text-red-700" />
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-red-600">34%</p>
                          <p className="text-sm text-red-700">Trabalho tradicional</p>
                          <p className="text-xs text-red-600">relatam infelicidade</p>
                        </div>
                      </div>
                      
                      <div className={`p-4 rounded-xl ${colorScheme.card} border-2 border-dashed`}>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Heart className="w-5 h-5 text-pink-500" />
                          <span className="font-bold text-pink-600">+23% mais felizes</span>
                          <Heart className="w-5 h-5 text-pink-500" />
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                          Pessoas que trabalham de casa com o que gostam
                        </p>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          Fonte: Universidade de Oxford, 2024
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={nextQuestion}
                    className={`w-full text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r ${colorScheme.button} shadow-2xl hover:shadow-xl transform hover:scale-105 text-xl border-4 border-white/70`}
                  >
                    Continuar
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Question Types */}
              {currentQ.type === 'single' && (
                <>
                  <div className="space-y-4 mb-6">
                    {currentQ.options?.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => handleSingleChoice(option.value)}
                        className={`w-full p-6 rounded-2xl border-4 transition-all duration-300 text-center hover:scale-102 transform hover:shadow-xl ${
                          selectedAnswers.includes(option.value)
                            ? `border-white bg-white/90 shadow-xl ${colorScheme.text}`
                            : `border-white/70 hover:border-white bg-white/50 hover:bg-white/80 ${colorScheme.text}`
                        } text-xl font-bold shadow-2xl`}
                        style={{
                          animationDelay: `${index * 100}ms`
                        }}
                      >
                        <span className="text-xl font-bold">{option.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={nextQuestion}
                    disabled={selectedAnswers.length === 0}
                    className={`w-full text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-gradient-to-r ${colorScheme.button} shadow-2xl hover:shadow-xl transform hover:scale-105 text-xl border-4 border-white/70`}
                  >
                    Continuar
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {currentQ.type === 'multi' && (
                <>
                  <div className="space-y-4 mb-6">
                    {currentQ.options?.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          playClickSound()
                          if (selectedAnswers.includes(option.value)) {
                            setSelectedAnswers(selectedAnswers.filter(a => a !== option.value))
                          } else {
                            setSelectedAnswers([...selectedAnswers, option.value])
                          }
                        }}
                        className={`w-full p-6 rounded-2xl border-4 transition-all duration-300 text-center hover:scale-102 transform hover:shadow-xl ${
                          selectedAnswers.includes(option.value)
                            ? `border-white bg-white/90 shadow-xl ${colorScheme.text}`
                            : `border-white/70 hover:border-white bg-white/50 hover:bg-white/80 ${colorScheme.text}`
                        } text-xl font-bold shadow-2xl`}
                        style={{
                          animationDelay: `${index * 100}ms`
                        }}
                      >
                        <span className="text-xl font-bold">{option.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={nextQuestion}
                    disabled={selectedAnswers.length === 0}
                    className={`w-full text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-gradient-to-r ${colorScheme.button} shadow-2xl hover:shadow-xl transform hover:scale-105 text-xl border-4 border-white/70`}
                  >
                    Continuar
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {currentQ.type === 'slider' && (
                <>
                  <div className="space-y-6 mb-6">
                    <div className="text-center">
                      <span className={`text-5xl font-bold ${colorScheme.accent}`}>{sliderValue}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderValue}
                      onChange={(e) => setSliderValue(Number(e.target.value))}
                      className="w-full h-4 bg-white/50 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${colorScheme.button.includes('from-') ? 'var(--tw-gradient-from)' : '#0EA5E9'} 0%, ${colorScheme.button.includes('from-') ? 'var(--tw-gradient-from)' : '#0EA5E9'} ${sliderValue}%, rgba(255,255,255,0.5) ${sliderValue}%, rgba(255,255,255,0.5) 100%)`
                      }}
                    />
                    <div className={`flex justify-between text-sm font-semibold ${colorScheme.accent}`}>
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={nextQuestion}
                    className={`w-full text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r ${colorScheme.button} shadow-2xl hover:shadow-xl transform hover:scale-105 text-xl border-4 border-white/70`}
                  >
                    Continuar
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Preview Download */}
              {quizState.previewUnlocked && currentQ.unlockPreview && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-center">
                  <div className="flex items-center justify-center gap-2 text-green-800 mb-2">
                    <Award className="w-5 h-5" />
                    <span className="font-semibold">Preview Desbloqueado!</span>
                  </div>
                  <button className="flex items-center justify-center gap-2 text-green-700 hover:text-green-900 transition-colors mx-auto">
                    <Download className="w-4 h-4" />
                    Baixar mini-padrão
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Sales Page
  const { targetEarning, timeCommitment, experienceLevel, days, analysis } = getPersonalizedData()
  
  return (
    <div className="min-h-screen bg-white relative">
      
      {/* Purchase Notifications */}
      {purchaseNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`fixed bottom-4 left-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-500 ${
            notification.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">
              {notification.name} acabou de comprar!
            </span>
          </div>
        </div>
      ))}

      {/* Discount Popup */}
      {showDiscountPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative animate-pulse">
            <button
              onClick={() => setShowDiscountPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-red-600 mb-4">
                🔥 OFERTA RELÂMPAGO!
              </h3>
              <p className="text-gray-800 mb-4">
                Você esperou tempo demais! Aqui está um desconto especial só para você:
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-red-600 line-through">De R$ 37,00</p>
                <p className="text-3xl font-bold text-red-600">Por apenas R$ 19,90</p>
                <p className="text-sm text-red-500">Desconto de 46%!</p>
              </div>
              
              <button
                onClick={handleDiscountCheckout}
                className="w-full bg-red-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-red-700 transition-all duration-300 mb-3"
              >
                Quero aproveitar o desconto!
              </button>
              
              <p className="text-xs text-gray-500">
                Esta oferta expira em 5 minutos
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header - HEADLINE VISÍVEL */}
          <div className="text-center mb-12 mt-8">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Seu Plano Personalizado para Faturar até {targetEarning}/mês com Crochê de Mesa Posta Está Pronto!
            </h1>
            
            <p className="text-xl text-blue-800 bg-blue-50 rounded-xl p-4 border border-blue-200">
              Com base nas suas respostas, esse é o seu plano ideal para começar a faturar em apenas {days} dias
            </p>
          </div>

          {/* Personalized Analysis - EM CARDS PRIMEIRO */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg border border-blue-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Nossa Análise Sobre Você</h2>
            
            {/* Cards da análise */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Tempo Disponível</h3>
                  <p className="text-blue-700 text-sm">{timeCommitment}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                <div className="text-center">
                  <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Nível de Experiência</h3>
                  <p className="text-blue-700 text-sm">{experienceLevel}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                <div className="text-center">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Meta Financeira</h3>
                  <p className="text-blue-700 text-sm">{targetEarning}/mês</p>
                </div>
              </div>
            </div>
            
            {/* Texto explicativo depois dos cards */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Como Vai Funcionar:</h3>
              <p className="text-blue-800 leading-relaxed">{analysis}</p>
            </div>
          </div>

          {/* What You'll Receive - App Information */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 shadow-lg border border-green-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Você Receberá um App Completo com Tudo Isso:</h2>
            <p className="text-center text-green-700 mb-6 italic">📱 Acesso via aplicativo exclusivo com todo o conteúdo organizado</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-md border border-green-200 flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-green-800">Método Completo Crochê de Mesa Posta: passo a passo para você começar mesmo sem experiência.</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-green-200 flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-green-800">Apostilas digitais e gráficos exclusivos para aprender crochê de mesa posta.</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-green-200 flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-green-800">Acesso a aulas em vídeo gravadas e práticas para acompanhar no seu ritmo.</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-green-200 flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-green-800">Técnicas de precificação para transformar seu trabalho em renda real.</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-green-200 flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-green-800">Estratégias de divulgação online para vender rápido e se destacar.</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-green-200 flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-green-800">Grupo de suporte exclusivo para tirar dúvidas e compartilhar resultados.</p>
              </div>
            </div>
          </div>

          {/* Exclusive Bonuses */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-2xl p-8 shadow-lg border border-orange-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
              <Gift className="w-8 h-8" />
              Bônus Exclusivos
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-orange-200 shadow-md">
                <p className="text-orange-800"><strong>🎁 Bônus 1</strong> Catálogo pronto de inspirações para criar suas primeiras peças.</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-orange-200 shadow-md">
                <p className="text-orange-800"><strong>🎁 Bônus 2</strong> Mini curso de fotografia de mesa posta para redes sociais.</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-orange-200 shadow-md">
                <p className="text-orange-800"><strong>🎁 Bônus 3</strong> Planilha de faturamento: organize seus ganhos de forma profissional.</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-orange-200 shadow-md">
                <p className="text-orange-800"><strong>🎁 Bônus 4</strong> Guia de fornecedores de fios e materiais mais baratos.</p>
              </div>
            </div>
          </div>

          {/* Imagem abaixo dos entregáveis */}
          <div className="text-center mb-8">
            <img 
              src="https://media.inlead.cloud/uploads/1072/2025-09-20/lg-mCQSB-pitch-feltro-2.png" 
              alt="Pitch Feltro" 
              className="w-full max-w-3xl mx-auto rounded-2xl shadow-lg"
            />
          </div>

          {/* About the Teacher - COM FOTO E TEXTO DA ISADORA */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 shadow-lg border border-green-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quem é a Professora</h2>
            <div className="bg-white rounded-xl p-6 shadow-md border border-green-200 flex flex-col items-center text-center gap-6">
              <img 
                src="https://media.inlead.cloud/uploads/1072/2025-09-20/md-F0REE-isadora-foto-inlead.png" 
                alt="Isadora Melo" 
                className="w-32 h-32 rounded-full object-cover border-4 border-green-200"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Isadora Melo</h3>
                <p className="text-green-800 mb-2">Criadora do Treinamento Mesa Posta Lucrativa, especialista em crochê e confecção de peças de mesa posta que encantam e vendem desde 2023.</p>
                <p className="text-green-800 mb-2">Comecei criando sousplats e porta-guardanapos de crochê como um simples passatempo, mas logo percebi que as peças de mesa posta têm um potencial incrível de gerar renda extra, com baixo custo e muita criatividade. ✨</p>
                <p className="text-green-800">Com o tempo, aprimorei minhas técnicas e transformei esse hobby em um negócio de verdade, criando composições personalizadas que conquistam clientes e tornam qualquer refeição ainda mais especial. Agora, quero te mostrar que você também pode viver da sua arte, criando peças lindas e cheias de valor no conforto da sua casa! 💰</p>
              </div>
            </div>
          </div>

          {/* Testimonials Section - APENAS 3 DEPOIMENTOS SEM FOTOS */}
          <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-8 shadow-lg border border-pink-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Veja o que nossos alunos estão falando</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-pink-200">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Maria Silva</h4>
                  <div className="flex text-yellow-500 mb-2">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <p className="text-pink-800 italic">
                  "Consegui faturar R$ 1.200 no meu primeiro mês! O método da Isadora é muito claro e fácil de seguir."
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-pink-200">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Ana Costa</h4>
                  <div className="flex text-yellow-500 mb-2">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <p className="text-pink-800 italic">
                  "Nunca pensei que conseguiria ganhar dinheiro com crochê. Em 2 meses já estava faturando R$ 2.500!"
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-pink-200">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Carla Santos</h4>
                  <div className="flex text-yellow-500 mb-2">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <p className="text-pink-800 italic">
                  "O curso mudou minha vida! Agora trabalho de casa e tenho mais tempo com meus filhos."
                </p>
              </div>
            </div>
          </div>

          {/* Special Offer Card - MENOS ROXO, MAIS AZUL */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-lg text-white mb-8 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                <TrendingUp className="w-8 h-8" />
                📦 Oferta Especial Última Turma com Desconto Exclusivo
              </h2>
              
              {/* Timer in the offer card */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6 inline-block">
                <div className="flex items-center justify-center gap-2 text-white">
                  <Clock className="w-5 h-5" />
                  <span className="font-bold text-xl">Oferta expira em: {formatTime(salesTimer)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4 mb-4">
                <div>
                  <p className="text-sm opacity-80 line-through">Valor normal: R$ 197,00</p>
                  <p className="text-4xl font-bold">Valor hoje: R$ 37,00</p>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg mb-4"
              >
                👉 Quero pegar meu plano completo por apenas R$ 37
              </button>
            </div>
          </div>

          {/* Guarantee */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 shadow-lg border border-green-200 text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔒 Garantia Total</h2>
            <p className="text-green-800 text-lg">
              Garantia de 7 dias: se você não gostar do método, devolvemos 100% do seu investimento.
            </p>
          </div>

          {/* Your Profile Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
              <Target className="w-6 h-6" />
              Seu Perfil Personalizado:
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-blue-800">Tempo: {timeCommitment}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                <Star className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-blue-800">Nível: {experienceLevel}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-blue-800">Meta: {targetEarning}/mês em {days} dias</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}