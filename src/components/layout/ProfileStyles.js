import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#rgb(220, 228, 250)',
        paddingTop: 18,
      },
      topSection: {
        alignItems: 'center',
        marginBottom: 20,
      },
      imageWrapper: {
        position: 'relative',
        marginBottom: 10,
        borderColor: '#2e3192',
        borderWidth: 10,
        borderRadius: 90,
      },
      image: {
        width: 140,
        height: 140,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#rgb(220, 228, 250)',
      },
      editIconWrapper: {
        position: 'absolute',
        right: 10,
        bottom: 0,
        borderRadius: 50,
        padding: 5,
      },
      userId: {
        fontSize: 14,
        color: '#2e3192',
        marginVertical: 5,
      },
      RatingValue: {
        fontSize: 14,
        color: '#2e3192',
        marginVertical: 5,
      },
      starsWrapper: {
        flexDirection: 'row',
        marginTop: 5,
      },
      nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      info: {
        fontSize: 20,
        color: 'black',
      },
      editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3ECF3',
        borderRadius: 8,
        padding: 8,
        bottom: 20,
      },
      editText: {
        marginLeft: 5,
        fontSize: 12,
        color: '#2e3192',
      },
      detailsSection: {
        backgroundColor: 'white',
        borderTopStartRadius: 40,
        borderTopEndRadius:40,
        padding: 25,
      },
      label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2e3192',
        marginVertical: 5,
      },
      info: {
        fontSize: 14,
        color: '#000',
        marginBottom: 10,
      },
      description: {
        fontSize: 14,
        color: '#000',
        marginBottom: 10,
      },
      performanceSection: {
        marginTop: 10,
      },
      performanceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2e3192',
        marginBottom: 10,
      },
      performanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
      },
      performanceLabel: {
        fontSize: 14,
        color: '#000',
      },
      stars: {
        flexDirection: 'row',
      },
});
