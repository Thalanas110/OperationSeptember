const poemsData = 
// arrays because fuck arrays, all "Elena Nightingale" poems are placeholders only for what's to come
[
    {
        id: 1,
        title: "placeholder poem 1",
        author: "Poems Under Construction",
        stanzas: [
            "In the gentle light of morning's birth,\nWhere shadows dance with golden rays,",
            "The world awakens from its slumber deep,\nAs nature paints the sky in amber haze,",
            "Dewdrops glisten on the emerald grass,\nLike diamonds scattered by the night,",
            "The songbirds herald the new day's start,\nWith melodies pure and voices bright,",
            "Time flows like honey, sweet and slow,\nIn moments blessed with morning's grace,",
            "And in this sacred hour of peace,\nI find my soul's eternal place."
        ]
    },
    {
        id: 2,
        title: "placeholder poem 2",
        author: "Poems Under Construction",
        stanzas: [
            "Beneath the moonlit silver waves,\nWhere mermaids weave their ancient songs,",
            "The ocean tells its timeless tales,\nOf love and loss, of rights and wrongs,",
            "Each ripple holds a memory,\nEach tide a story yet untold,",
            "The coral gardens bloom below,\nWith colors warm and spirits bold,",
            "In depths where sunlight cannot reach,\nThe mysteries of ages dwell,",
            "And sailors' dreams find peaceful rest,\nIn ocean's eternal, mystic spell."
        ]
    },
    {
        id: 3,
        title: "placeholder poem 3",
        author: "Poems Under Construction",
        stanzas: [
            "When leaves transform to gold and red,\nAnd autumn's breath grows crisp and clear,",
            "The trees release their summer crowns,\nTo mark the closing of the year,",
            "Each falling leaf a gentle kiss,\nFrom nature's hand to earth below,",
            "The harvest moon shines overhead,\nWith warm and amber, honey glow,",
            "In this season of reflection,\nWe gather close what matters most,",
            "And find in autumn's gentle grace,\nThe love that warms us coast to coast."
        ]
    },
    {
        id: 4,
        title: "placeholder poem 4",
        author: "Poems Under Construction",
        stanzas: [
            "Among the constellation's dance,\nWhere starlight weaves its silver thread,",
            "The universe unfolds its arms,\nAbove our small and humble bed,",
            "Each star a wish, each wish a dream,\nThat travels through the cosmic night,",
            "The galaxies spin endlessly,\nIn symphonies of pure delight,",
            "We are but dust among the stars,\nYet in our hearts, we hold the sky,",
            "And in the darkness, find our way,\nBy starlight's eternal lullaby."
        ]
    },
    {
        id: 5,
        title: "placeholder poem 5",
        author: "Poems Under Construction",
        stanzas: [
            "In secret gardens of the mind,\nWhere roses bloom in endless spring,",
            "The heart plants seeds of hope and love,\nAnd tends to every growing thing,",
            "Each flower holds a cherished thought,\nEach vine a memory sweet and true,",
            "The fountains flow with liquid light,\nReflecting skies of sapphire blue,",
            "Here time stands still in beauty's realm,\nWhere dreams take root and flourish free,",
            "And in this garden of the soul,\nWe find who we're meant to be."
        ]
    },
    {
        id: 6,
        title: "placeholder poem 6",
        author: "Poems Under Construction",
        stanzas: [
            "Upon the peaks where eagles soar,\nAnd clouds embrace the mountain's crown,",
            "The ancient stones hold wisdom deep,\nFrom ages past to current town,",
            "Each craggy cliff and windswept ridge,\nTells stories of the earth's great might,",
            "The valleys sleep in morning mist,\nWhile summits catch the golden light,",
            "Here silence speaks in thunderous tones,\nOf majesty beyond compare,",
            "And climbing high, we touch the sky,\nAnd breathe the pure and sacred air."
        ]
    },
    {
        id: 7,
        title: "placeholder poem 7",
        author: "Poems Under Construction",
        stanzas: [
            "From mountain spring to ocean vast,\nThe river carves its destined way,",
            "Through meadows green and valleys wide,\nIt dances on from night to day,",
            "Each bend reveals a new surprise,\nEach rapid sings a different song,",
            "The willows bow in reverence,\nAs waters flow both swift and strong,",
            "Like life itself, the river flows,\nThrough calm and storm, through joy and strife,",
            "And teaches us to bend, not break,\nIn the eternal dance of life."
        ]
    },
    {
        id: 8,
        title: "placeholder poem 8",
        author: "Poems Under Construction",
        stanzas: [
            "In lands where sand meets endless sky,\nAnd heat waves dance in mirage dreams,",
            "The desert holds its secret life,\nIn hidden valleys, underground streams,",
            "When rare rains bless the thirsty earth,\nA miracle unfolds in bloom,",
            "The cacti burst with colors bright,\nDispelling all the sandy gloom,",
            "Here patience is the greatest gift,\nAnd beauty comes to those who wait,",
            "The desert teaches us that life,\nCan flourish in the most sparse state."
        ]
    },
    {
        id: 9,
        title: "placeholder poem 9",
        author: "Poems Under Construction",
        stanzas: [
            "When snowflakes fall like angel's tears,\nAnd ice transforms the world to white,",
            "The earth lies sleeping 'neath her quilt,\nPreparing for the spring's delight,",
            "Each crystal is a work of art,\nNo two the same in all their form,",
            "The silence blankets all the land,\nA peace that follows every storm,",
            "In winter's grip, we find the strength,\nThat lies within our inner fire,",
            "And learn that after every cold,\nComes warmth and all that we desire."
        ]
    },
    {
        id: 10,
        title: "placeholder poem 10",
        author: "Poems Under Construction",
        stanzas: [
            "Where neon signs light up the night,\nAnd millions chase their urban dreams,",
            "The city hums with restless life,\nAnd nothing's quite the way it seems,",
            "Each window tells a different tale,\nOf love and loss, of hope and fear,",
            "The streets pulse with humanity,\nAs people disappear and reappear,",
            "In concrete jungles, hearts still beat,\nWith rhythms ancient as the earth,",
            "And in the chaos, we can find,\nOur purpose and our human worth."
        ]
    },
    {
        id: 11,
        title: "placeholder poem 11",
        author: "Poems Under Construction",
        stanzas: [
            "On wings of silk and morning dew,\nThe butterflies begin their flight,",
            "From flower cup to flower cup,\nThey paint the garden with delight,",
            "Each flutter speaks of transformation,\nFrom caterpillar's earthbound crawl,",
            "To soaring high on rainbow wings,\nAnswering beauty's sacred call,",
            "They teach us that change brings new life,\nAnd growth requires letting go,",
            "Of who we were, to who we are,\nAnd who we're destined yet to grow."
        ]
    },
    {
        id: 12,
        title: "placeholder poem 12",
        author: "Poems Under Construction",
        stanzas: [
            "When darkness wraps the world in calm,\nAnd midnight strikes its sacred hour,",
            "The moon looks down with gentle eyes,\nAnd grants the night its healing power,",
            "The crickets sing their lullabies,\nThe owls call out across the lea,",
            "And in this quiet sanctuary,\nOur weary souls find harmony,",
            "Here worries fade like morning mist,\nAnd peace descends on heart and mind,",
            "In midnight's blessed solitude,\nThe rest our spirits long to find."
        ]
    }
];