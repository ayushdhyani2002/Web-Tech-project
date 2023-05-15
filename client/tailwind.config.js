module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'sm': '375px',
      'md': '1040px',
      'lg': '1440px', 
      'smm': {'max': '375px'},
      'mdm': {'max': '1040px'},
      'lgm': {'max': '1440px'},
    },
    // custom colors
    colors: {
      't-grey': 'hsl(0, 0%, 75%)',
      'c-cyan'  : 'hsl(180, 66%, 49%)',
      'c-white' : 'hsl(0, 0%, 100%)',
      'c-white-2' :'hsl(230, 25%, 95%)',
      'c-very-dark-blue' : 'hsl(255, 11%, 22%)',
      'c-dark-violet': 'hsl(257, 27%, 26%)',
      'c-very-dark-violet':'hsl(260, 8%, 14%)',
      'c-red' :'hsl(0, 87%, 67%)',
      'c-blue' :"#002970", 
      'c-pink' : '#F2F0F9',
      'd-blue' : '#6D5BD0',
      'd-blue-2':"#6E6893",
      'd-grey' : "#E6E6F2",
      
    },
    // custom fonts
    fontFamily: {
      'Poppins': ['Poppins'],
    },
    
  },
  plugins: [],
}

